import os
import json
import pandas as pd
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

def parse_json_cell(cell):
    if pd.isna(cell) or cell == "":
        return None
    try:
        cleaned = cell.replace('""', '"')
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {cell[:50]}... Error: {e}")
        return None

def embed_tasks(file_content):

    QDRANT_URL = os.environ.get("QDRANT_URL")
    QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY")
    
    if not QDRANT_URL or not QDRANT_API_KEY:
        raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in environment variables")
    
    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
    
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    
    df = pd.read_csv(file_content)
    
    points = []
    
    for _, row in df.iterrows():
        task_id = int(row['task_id'])
        task_type = str(row['task_type'])
        duration_minutes = int(row['duration_minutes'])
        
        required_skills = parse_json_cell(row['required_skills'])
        employee_assigned = int(row['employee_assigned']) if pd.notna(row['employee_assigned']) else None
        outcome = str(row['outcome'])
        
        if required_skills is None:
            required_skills = {}
        
        required_skills_json = json.dumps(required_skills)
        
        embedding_text = f"Task of type {task_type} requiring skills {required_skills_json} with duration {duration_minutes} minutes"
        
        embedding = model.encode(embedding_text).tolist()
        
        payload = {
            "task_id": task_id,
            "task_type": task_type,
            "duration_minutes": duration_minutes,
            "required_skills": required_skills,
            "employee_assigned": employee_assigned,
            "outcome": outcome
        }
        
        points.append({
            "id": task_id,
            "vector": embedding,
            "payload": payload
        })
        
        if len(points) >= 50:
            client.upsert(
                collection_name="tasks",
                points=points
            )
            print(f"Upserted {len(points)} tasks")
            points = []
    
    if points:
        client.upsert(
            collection_name="tasks",
            points=points
        )
        print(f"Upserted final {len(points)} tasks")
    
    print("Task embedding complete!")