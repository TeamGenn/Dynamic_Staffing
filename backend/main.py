from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Dict
from scripts.embed_tasks import embed_tasks
from scripts.embed_employees import embed_employees
from io import StringIO
from datetime import datetime
import uuid
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

tasks = []

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
    
class TaskCreateResponse(BaseModel):
    task_id: str
    status: str = "created"

@app.get("/health")
def health():
    return {"status": "ok"}

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
async def create_task(payload: TaskCreateRequest):

    global tasks

    print("Tasks:", tasks)
    
    if payload.priority not in range(1, 6):
        raise HTTPException(status_code=400, detail="priority must be between 1 and 5")

    
    if payload.end_datetime <= payload.start_datetime:
        raise HTTPException(status_code=400, detail="end_datetime must be after start_datetime")

    task_id = str(uuid.uuid4())

    task_data = payload.model_dump()

    tasks.append(task_data)

    return TaskCreateResponse(
        task_id=task_id
    )