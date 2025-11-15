# Qdrant Embeddings Pipeline Setup

## Prerequisites

1. Python 3.8 or higher
2. Qdrant Cloud account with URL and API key

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

Or install individually:
```bash
pip install qdrant-client sentence-transformers pandas
```

## Step 2: Set Environment Variables

### Windows (PowerShell):
```powershell
$env:QDRANT_URL="your-qdrant-cloud-url"
$env:QDRANT_API_KEY="your-api-key"
```

### Windows (Command Prompt):
```cmd
set QDRANT_URL=your-qdrant-cloud-url
set QDRANT_API_KEY=your-api-key
```

### Linux/Mac:
```bash
export QDRANT_URL="your-qdrant-cloud-url"
export QDRANT_API_KEY="your-api-key"
```

**Note:** Replace `your-qdrant-cloud-url` and `your-api-key` with your actual Qdrant Cloud credentials.

## Step 3: Run the Pipeline

Execute the scripts in this order:

### 1. Setup Qdrant Collections
```bash
python qdrant_setup.py
```
This creates the "employees" and "tasks" collections.

### 2. Embed Employees
```bash
python embed_employees.py
```
This reads `data/employees.csv` and inserts embeddings into Qdrant.

### 3. Embed Tasks
```bash
python embed_tasks.py
```
This reads `data/historical_tasks.csv` and inserts embeddings into Qdrant.

### 4. Test Search
```bash
python test_search.py
```
This tests semantic search on the employees collection.

## Troubleshooting

- **Missing environment variables**: Make sure QDRANT_URL and QDRANT_API_KEY are set
- **File not found**: Ensure you're running from the project root directory
- **Connection errors**: Verify your Qdrant Cloud URL and API key are correct

