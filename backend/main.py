from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response, Depends, Cookie
from pydantic import BaseModel, Field
from typing import Literal, Dict
from scripts.embed_tasks import embed_tasks
from scripts.embed_employees import embed_employees
from io import StringIO
from datetime import datetime
import uuid
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import json
from backend.db import SessionLocal, Task
from backend.ai.analyze_and_match import analyze_and_match
from backend.scheduler import schedule

load_dotenv()

app = FastAPI()

def _get_port() -> int:
    """Return the port FastAPI should bind to."""
    import os

    try:
        return int(os.getenv("PORT", "10000"))
    except ValueError:
        return 10000

class UploadResponse(BaseModel):
    message: str
    filename: str
    data_type: str
    size_in_bytes: int

class TaskCreateRequest(BaseModel):
    task_type: str = Field(..., description="Type/category of the task, e.g., 'product_inquiry'")
    duration_minutes: int = Field(..., gt=0, description="Estimated duration of task in minutes")
    required_skills: Dict[str, int] = Field(
        ..., description="Dictionary of required skills and their levels, e.g., {'documentation': 9}"
    )
    priority: int = Field(..., ge=1, le=5, description="Priority of task, 1 (low) to 5 (high)")
    start_datetime: datetime = Field(..., description="Earliest start for the task")
    end_datetime: datetime = Field(..., description="Latest end for the task")

class EmployeesSearchRequest(BaseModel):
    task_id: str = Field(..., description="Unique Id of the task")
    task_type: str = Field(..., description="Type/category of the task, e.g., 'product_inquiry'")
    duration_minutes: int = Field(..., gt=0, description="Estimated duration of task in minutes")
    required_skills: Dict[str, int] = Field(
        ..., description="Dictionary of required skills and their levels, e.g., {'documentation': 9}"
    )
    priority: int = Field(..., ge=1, le=5, description="Priority of task, 1 (low) to 5 (high)")
    start_datetime: datetime = Field(..., description="Earliest start for the task")
    end_datetime: datetime = Field(..., description="Latest end for the task")
    
class TaskCreateResponse(BaseModel):
    task_id: str
    status: str = "created"

def get_db():

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/init-session")
async def init_session(response: Response):

    session_token = str(uuid.uuid4())

    response.set_cookie(key="session_token", value=session_token)

    return {"session_token": session_token}

@app.post("/upload", response_model=UploadResponse)
async def upload(
    file: UploadFile = File(...),
    data_type: Literal["employees_profiles", "historical_tasks"] = Form(...)
):
    
    if file.content_type != "text/csv" and not file.filename.endswith(".csv"):

        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed."
        )
    
    content = await file.read()
    content_str = content.decode('utf-8')

    if len(content_str) > 0:

        if data_type == "employees_profiles":

            embed_employees(file_content=StringIO(content_str))

        elif data_type == "historical_tasks":

            embed_tasks(file_content=StringIO(content_str))
        
        else:

            raise HTTPException(
                status_code=400,
                detail="Unknown data_type."
            )
    
    else:

        raise HTTPException(
            status_code=400,
            detail="No content found in file."
        )

    return {
        "message": "CSV uploaded successfully.",
        "filename": file.filename,
        "data_type": data_type,
        "size_in_bytes": len(content_str)
    }

@app.post("/create-task", response_model=TaskCreateResponse)
async def create_task(payload: TaskCreateRequest, db: Session = Depends(get_db), session_token: str = Cookie(None)):

    if not session_token:
        raise HTTPException(status_code=400, detail="Session token missing. Please generate a session first.")
    
    if payload.priority not in range(1, 6):
        raise HTTPException(status_code=400, detail="priority must be between 1 and 5")

    if payload.end_datetime <= payload.start_datetime:
        raise HTTPException(status_code=400, detail="end_datetime must be after start_datetime")

    task = Task(
        task_id=str(uuid.uuid4()),
        session_token=session_token,
        task_type=payload.task_type,
        duration_minutes=payload.duration_minutes,
        required_skills=json.dumps(payload.required_skills),
        priority=payload.priority,
        start_datetime=payload.start_datetime,
        end_datetime=payload.end_datetime
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return TaskCreateResponse(
        task_id=task.task_id
    )

@app.get("/get-schedule")
async def get_schedule(
    db: Session = Depends(get_db),
    session_token: str = Cookie(None)
):

    if not session_token:

        raise HTTPException(status_code=400, detail="Session token missing. Please generate a session first.")
    
    unassigned_tasks = db.query(Task).filter(
        Task.session_token == session_token
    ).all()

    if not unassigned_tasks:
        return {"message": "No tasks to schedule."}
    
    schedule_list = []
    for task in unassigned_tasks:
        schedule_list.append({
            "task_id": task.task_id,
            "task_type": task.task_type,
            "duration_minutes": task.duration_minutes,
            "priority": task.priority,
            "required_skills": task.required_skills,
            "start_datetime": task.start_datetime,
            "end_datetime": task.end_datetime
        })

    # Sort tasks by priority and deadline using scheduler
    sorted_tasks = schedule(schedule_list)

    return {"schedule": sorted_tasks}

@app.post("/search-employees")
async def search_employees(payload: EmployeesSearchRequest):
    """
    Search for employees matching task requirements using AI-powered analysis.
    
    This endpoint uses the AI engine to:
    1. Analyze task complexity using Gemini
    2. Search for matching employees using Qdrant semantic search
    3. Generate recommendations combining both analyses
    """
    try:
        # Prepare task payload for AI engine
        task_payload = {
            "task_type": payload.task_type,
            "description": "",  # Optional: could add description field to request
            "required_skills": payload.required_skills,  # Now a Dict[str, int]
            "priority": payload.priority
        }
        
        # Call AI engine for full analysis
        result = analyze_and_match(task_payload)
        
        # Return comprehensive AI analysis results
        return {
            "task_id": payload.task_id,
            "complexity_analysis": result["complexity_analysis"],
            "top_employees": result["top_employees"],
            "recommendation_summary": result["recommendation_summary"]
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=_get_port(),
    )
