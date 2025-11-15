import os
import json
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

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
    
    skills = {"customer_service": 7, "sales": 5}
    skills_json = json.dumps(skills)
    
    query_text = f"Task requiring skills {skills_json}"
    
    embedding = model.encode(query_text).tolist()
    
    results = client.search(
        collection_name="employees",
        query_vector=embedding,
        limit=5
    )
    
    print(f"Query: {query_text}")
    print("\nTop 5 matching employees:")
    print("-" * 60)
    
    for i, result in enumerate(results, 1):
        employee_name = result.payload.get("name", "Unknown")
        score = result.score
        print(f"{i}. {employee_name} - Score: {score:.4f}")

if __name__ == "__main__":
    main()

