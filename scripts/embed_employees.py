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

def main():
    QDRANT_URL = os.environ.get("QDRANT_URL")
    QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY")
    
    if not QDRANT_URL or not QDRANT_API_KEY:
        raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in environment variables")
    
    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
    
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    
    df = pd.read_csv('data/employees.csv')
    
    points = []
    
    for _, row in df.iterrows():
        employee_id = int(row['employee_id'])
        name = str(row['name'])
        hourly_rate = float(row['hourly_rate'])
        
        skills = parse_json_cell(row['skills'])
        certifications = parse_json_cell(row['certifications'])
        availability = parse_json_cell(row['availability'])
        performance_history = parse_json_cell(row['performance_history'])
        
        weekly_max_hours = int(row['weekly_max_hours'])
        
        if skills is None:
            skills = {}
        if certifications is None:
            certifications = []
        if availability is None:
            availability = {}
        if performance_history is None:
            performance_history = {}
        
        skills_json = json.dumps(skills)
        certs_json = json.dumps(certifications)
        
        performance_rating = 0.0
        if performance_history:
            ratings = list(performance_history.values())
            if ratings:
                performance_rating = sum(ratings) / len(ratings)
        
        embedding_text = f"Employee with skills {skills_json}, certifications {certs_json}, performance rating {performance_rating}"
        
        embedding = model.encode(embedding_text).tolist()
        
        payload = {
            "employee_id": employee_id,
            "name": name,
            "hourly_rate": hourly_rate,
            "skills": skills,
            "certifications": certifications,
            "availability": availability,
            "max_hours": weekly_max_hours,
            "performance_rating": performance_rating,
            "past_task_success": performance_history
        }
        
        points.append({
            "id": employee_id,
            "vector": embedding,
            "payload": payload
        })
        
        if len(points) >= 50:
            client.upsert(
                collection_name="employees",
                points=points
            )
            print(f"Upserted {len(points)} employees")
            points = []
    
    if points:
        client.upsert(
            collection_name="employees",
            points=points
        )
        print(f"Upserted final {len(points)} employees")
    
    print("Employee embedding complete!")

if __name__ == "__main__":
    main()

