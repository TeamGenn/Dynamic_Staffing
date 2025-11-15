# Dynamic Staffing & Scheduling Agent - Setup Instructions

## Project Structure

```
Dynamic_Staffing/
├── data/
│   ├── employees.csv
│   ├── historical_tasks.csv
├── backend/
│   ├── main.py                     # FastAPI application
│   ├── scheduler.py                # Scheduling logic
│   ├── search_employees.py        # Employee search functionality
│   ├── gemini_task_complexity.py  # Task complexity analysis
│   ├── gemini_tradeoff_analysis.py # Tradeoff analysis
│   ├── models/                     # Data models
│   ├── routes/                     # API routes
│   └── utils/                      # Utility functions
├── scripts/
│   ├── qdrant_setup.py            # Qdrant collection setup
│   ├── embed_employees.py         # Employee embedding pipeline
│   ├── embed_tasks.py             # Task embedding pipeline
│   ├── test_search.py             # Search testing
│   ├── generate_employees.py      # Employee data generation
│   ├── generate_historical_tasks.py # Task data generation
│   ├── fix_availability.py        # Availability data fixes
│   └── transform_availability.py   # Availability transformations
├── frontend/                       # React frontend (to be implemented)
├── .gitignore
├── requirements.txt
└── run_pipeline.ps1
```

## Prerequisites

1. Python 3.8 or higher
2. Qdrant Cloud account with URL and API key
3. FastAPI and Uvicorn (for backend API)

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

Or install individually:
```bash
pip install qdrant-client sentence-transformers pandas fastapi uvicorn
```

## Step 2: Set Environment Variables

### Windows (PowerShell):
```powershell
$env:QDRANT_URL="your-qdrant-cloud-url"
$env:QDRANT_API_KEY="your-api-key"
$env:GEMINI_API_KEY="your-gemini-api-key"  # For Gemini features
```

### Windows (Command Prompt):
```cmd
set QDRANT_URL=your-qdrant-cloud-url
set QDRANT_API_KEY=your-api-key
set GEMINI_API_KEY=your-gemini-api-key
```

### Linux/Mac:
```bash
export QDRANT_URL="your-qdrant-cloud-url"
export QDRANT_API_KEY="your-api-key"
export GEMINI_API_KEY="your-gemini-api-key"
```

**Note:** Replace the placeholder values with your actual credentials.

## Step 3: Run the Embedding Pipeline (Optional)

**Skip this step if you already have Qdrant Cloud set up with the "employees" and "tasks" collections containing data.**

If you need to set up Qdrant from scratch, execute the scripts in this order (from project root):

### 1. Setup Qdrant Collections
```bash
python scripts/qdrant_setup.py
```
This creates the "employees" and "tasks" collections.

### 2. Embed Employees
```bash
python scripts/embed_employees.py
```
This reads `data/employees.csv` and inserts embeddings into Qdrant.

### 3. Embed Tasks
```bash
python scripts/embed_tasks.py
```
This reads `data/historical_tasks.csv` and inserts embeddings into Qdrant.

### 4. Test Search (Optional)
```bash
python scripts/test_search.py
```
This tests semantic search on the employees collection.

## Step 4: Run the Backend API

Start the FastAPI server:

```bash
cd backend
uvicorn main:app --reload
```

Or from project root:
```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`
- Health check: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`

## Troubleshooting

- **Missing environment variables**: Make sure QDRANT_URL, QDRANT_API_KEY, and GEMINI_API_KEY are set
- **File not found**: Ensure you're running from the project root directory
- **Connection errors**: Verify your Qdrant Cloud URL and API key are correct
- **Import errors**: Make sure you're using the correct import paths (e.g., `from backend.gemini_task_complexity import ...`)

