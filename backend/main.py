from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Literal
from scripts.embed_tasks import embed_tasks
from scripts.embed_employees import embed_employees
from io import StringIO
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class UploadResponse(BaseModel):
    message: str
    filename: str
    data_type: str
    size_in_bytes: int

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