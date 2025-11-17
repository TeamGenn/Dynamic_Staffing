import os
import json
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

def search(task):
    QDRANT_URL = os.environ.get("QDRANT_URL")
    QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY")
    
    if not QDRANT_URL or not QDRANT_API_KEY:
        raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in environment variables")
    
    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
    
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    
    skills_text = ", ".join(f"{skill} level {lvl}" for skill, lvl in json.loads(task['required_skills']).items())
    priority_text = {5: "highest", 4: "high", 3: "medium", 2: "low", 1: "lowest"}[task['priority']]

    query_text = (
        f"Task type: {task['task_type']}. "
        f"Required skills: {skills_text}. "
        f"Priority: {priority_text}. "
        f"Duration: {task['duration_minutes']} minutes."
    )
    
    embedding = model.encode(query_text).tolist()
    
    results = client.search(
        collection_name="employees",
        query_vector=embedding,
        limit=5
    )
    
    employees = []
    
    for i, result in enumerate(results, 1):

        print(result)

        employee_name = result.payload.get("name", "Unknown")
        score = result.score
        print(f"{i}. {employee_name} - Score: {score:.4f}")