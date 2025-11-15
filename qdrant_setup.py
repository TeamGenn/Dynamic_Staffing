import os
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

def recreate_collection(client, collection_name, vectors_config):
    """Delete collection if exists and create a new one."""
    try:
        client.delete_collection(collection_name)
        print(f"Deleted existing collection: {collection_name}")
    except Exception as e:
        print(f"Collection {collection_name} does not exist or error deleting: {e}")
    
    client.create_collection(
        collection_name=collection_name,
        vectors_config=vectors_config
    )
    print(f"Created collection: {collection_name}")

def main():
    QDRANT_URL = os.environ.get("QDRANT_URL")
    QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY")
    
    if not QDRANT_URL or not QDRANT_API_KEY:
        raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in environment variables")
    
    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
    
    vectors_config = VectorParams(
        size=384,
        distance=Distance.COSINE
    )
    
    recreate_collection(client, "employees", vectors_config)
    recreate_collection(client, "tasks", vectors_config)
    
    print("Setup complete!")

if __name__ == "__main__":
    main()

