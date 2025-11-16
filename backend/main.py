from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

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
    data_type: str = Form(...)
):
    
    if file.content_type != "text/csv" and not file.filename.endswith(".csv"):

        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed."
        )
    
    content = await file.read()

    print("File Content:", content)

    return {
        "message": "CSV uploaded successfully.",
        "filename": file.filename,
        "data_type": data_type,
        "size_in_bytes": len(content)
    }