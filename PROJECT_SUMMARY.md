# Dynamic Staffing & Scheduling Agent - Complete Project Summary

## 📋 Overview

**Dynamic Staffing & Scheduling Agent** is an intelligent workforce management system that combines AI-powered task analysis with semantic employee search to optimize task-employee matching and scheduling decisions. The system uses Google Gemini 2.0 Flash for task complexity analysis and Qdrant vector database for semantic employee matching.

---

## 🏗️ Architecture

### **Backend (FastAPI)**
- **`backend/main.py`**: Main FastAPI application with REST API endpoints
- **`backend/db.py`**: SQLAlchemy database models and session management (SQLite)
- **`backend/scheduler.py`**: Task scheduling logic (sorts by priority and deadline)
- **`backend/search_employees.py`**: Placeholder for employee search functionality

### **AI Engine (`backend/ai/`)**
- **`analyze_and_match.py`**: **Core AI engine** that combines:
  - Gemini task complexity analysis
  - Qdrant semantic employee search
  - Recommendation generation
- **`gemini_task_complexity.py`**: Analyzes task complexity using Gemini 2.0 Flash
- **`gemini_tradeoff_analysis.py`**: Analyzes scheduling tradeoffs (cost vs. quality, coverage, etc.)

### **Scripts (`scripts/`)**
- **Setup Scripts**:
  - `setup_qdrant.py`: Creates/recreates Qdrant collections
  - `setup_employees_collection.py`: Sets up employees collection
  - `setup_tasks_collection.py`: Sets up tasks collection
- **Embedding Scripts**:
  - `embed_employees.py`: Embeds employee data into Qdrant
  - `embed_tasks.py`: Embeds task data into Qdrant
- **Search & Utilities**:
  - `search_employees.py`: Employee search using Qdrant semantic search
  - `OpusClient.py`: Integration with Opus workflow automation platform
  - `test_search.py`: Test script for Qdrant search
- **Data Generation**:
  - `generate_employees.py`: Generates sample employee data
  - `generate_historical_tasks.py`: Generates sample historical task data
  - `fix_availability.py`: Fixes availability data format
  - `transform_availability.py`: Transforms availability data structure

### **Data (`data/`)**
- `employees.csv`: Employee profiles with skills, certifications, availability, performance
- `historical_tasks.csv`: Historical task data for analysis

---

## 🔑 Core Features

### 1. **AI-Powered Task-Employee Matching**
The `analyze_and_match()` function is the heart of the system:

**Input:**
```python
{
    "task_type": "phone_support",
    "description": "Handle customer calls",
    "required_skills": {"communication": 7, "customer_service": 5},
    "priority": 2
}
```

**Output:**
```python
{
    "complexity_analysis": {
        "complexity_score": 7,
        "recommended_skills": {...},
        "challenges": [...],
        "duration_estimate": {...}
    },
    "top_employees": [
        {"employee_name": "Alice", "score": 0.76},
        {"employee_name": "Bob", "score": 0.71}
    ],
    "recommendation_summary": "This is a high-complexity task..."
}
```

**Process:**
1. **Step 1**: Gemini analyzes task complexity, estimates duration, identifies challenges
2. **Step 2**: Qdrant searches for top matching employees using semantic embeddings
3. **Step 3**: System generates actionable recommendations combining both analyses

### 2. **REST API Endpoints**

#### **Health & Session**
- `GET /health`: Health check endpoint
- `GET /init-session`: Initialize session and get session token (cookie-based)

#### **Data Upload**
- `POST /upload`: Upload CSV files (employees or historical tasks)
  - Accepts: `employees_profiles` or `historical_tasks`
  - Automatically embeds data into Qdrant

#### **Task Management**
- `POST /create-task`: Create a new task
  - Requires: task_type, duration_minutes, required_skills, priority, start_datetime, end_datetime
  - Stores in SQLite database
  - Returns: task_id

- `GET /get-schedule`: Get schedule for current session
  - Returns all tasks for the session token
  - Currently returns raw task list (scheduling logic to be integrated)

#### **Employee Search**
- `POST /search-employees`: Search for employees matching task requirements
  - Uses Qdrant semantic search
  - Returns top 5 matching employees with full payload

### 3. **Task Scheduling**
- `backend/scheduler.py`: Basic scheduling algorithm
  - Sorts tasks by priority (descending) and deadline (ascending)
  - Currently prints sorted tasks (to be integrated with employee assignment)

### 4. **Tradeoff Analysis**
- `gemini_tradeoff_analysis.py`: Analyzes scheduling tradeoffs
  - Input: schedule, budget, coverage percentage, availability constraints, detected issues
  - Output: Recommendations with cost impact, risk reduction, priority, confidence
  - Generates alerts for issues (understaffed, overtime risk, etc.)

---

## 🛠️ Technology Stack

### **Backend Framework**
- **FastAPI**: Modern Python web framework with automatic API documentation
- **SQLAlchemy**: ORM for SQLite database
- **Uvicorn**: ASGI server

### **AI/ML**
- **Google Gemini 2.0 Flash**: Task complexity analysis and tradeoff analysis
- **Sentence Transformers** (all-MiniLM-L6-v2): Text embeddings for semantic search
- **Qdrant Cloud**: Vector database for employee and task embeddings

### **Data Processing**
- **Pandas**: CSV data processing
- **Python-dotenv**: Environment variable management

### **External Integrations**
- **Opus Platform**: Workflow automation integration (`OpusClient.py`)

---

## 📁 Project Structure

```
Dynamic_Staffing/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── db.py                      # Database models (SQLite)
│   ├── scheduler.py               # Scheduling logic
│   ├── search_employees.py        # Employee search (placeholder)
│   ├── ai/
│   │   ├── analyze_and_match.py   # Main AI engine ⭐
│   │   ├── gemini_task_complexity.py
│   │   └── gemini_tradeoff_analysis.py
│   ├── models/                    # (empty - for future data models)
│   ├── routes/                    # (empty - for future route modules)
│   └── utils/                     # (empty - for utility functions)
│
├── scripts/
│   ├── setup_qdrant.py            # Qdrant collection setup
│   ├── setup_employees_collection.py
│   ├── setup_tasks_collection.py
│   ├── embed_employees.py         # Employee embedding pipeline
│   ├── embed_tasks.py             # Task embedding pipeline
│   ├── search_employees.py        # Qdrant employee search
│   ├── OpusClient.py              # Opus platform integration
│   ├── test_search.py             # Search testing
│   ├── generate_employees.py      # Data generation
│   ├── generate_historical_tasks.py
│   ├── fix_availability.py
│   └── transform_availability.py
│
├── data/
│   ├── employees.csv              # Employee profiles
│   └── historical_tasks.csv       # Historical task data
│
├── frontend/                      # (empty - for React frontend)
│
├── test_application.py             # Comprehensive test suite
├── test_qdrant_only.py            # Qdrant-only test
├── run_app.ps1                    # PowerShell application runner
├── run_pipeline.ps1               # Pipeline runner
├── run_with_venv.ps1              # Virtual environment runner
├── example.env                    # Environment variable template
├── requirements.txt               # Python dependencies
├── README.md                      # Project overview
├── HOW_TO_RUN.md                  # Detailed run instructions
├── SETUP_INSTRUCTIONS.md          # Setup guide
└── PROJECT_SUMMARY.md             # This file
```

---

## 🔧 Key Components Explained

### **1. AI Engine (`analyze_and_match.py`)**

**Purpose**: Combines Gemini AI analysis with Qdrant semantic search to recommend optimal employee-task matches.

**Key Functions**:
- `analyze_and_match()`: Main orchestration function
- `search_employees()`: Qdrant semantic search
- `generate_recommendation_summary()`: Text summary generation

**Workflow**:
```
Task Input → Gemini Complexity Analysis → Qdrant Employee Search → Recommendation
```

### **2. FastAPI Application (`main.py`)**

**Features**:
- Session management (cookie-based)
- CSV file upload with automatic embedding
- Task CRUD operations (SQLite)
- Employee search endpoint
- Automatic API documentation at `/docs`

**Database**: SQLite (`backend/tasks.db`)
- Stores tasks with: task_id, session_token, task_type, duration, skills, priority, datetimes

### **3. Qdrant Integration**

**Collections**:
- `employees`: Employee embeddings (384-dimensional vectors)
- `tasks`: Task embeddings (384-dimensional vectors)

**Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions)

**Search Method**: Cosine similarity

### **4. Gemini Integration**

**Models Used**:
- `gemini-2.0-flash-exp`: For task complexity and tradeoff analysis

**Capabilities**:
- Task complexity scoring (1-10)
- Duration estimation (optimistic, likely, pessimistic)
- Challenge identification
- Tradeoff analysis with recommendations

---

## 🚀 Usage Examples

### **1. Run AI Engine Directly**

```python
from backend.ai.analyze_and_match import analyze_and_match

task = {
    "task_type": "phone_support",
    "description": "Handle customer calls",
    "required_skills": {"communication": 7, "customer_service": 5},
    "priority": 2
}

result = analyze_and_match(task)
print(result["recommendation_summary"])
```

### **2. Use FastAPI Endpoints**

```bash
# Start server
uvicorn backend.main:app --reload

# Create task
curl -X POST "http://localhost:8000/create-task" \
  -H "Cookie: session_token=your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "customer_support",
    "duration_minutes": 30,
    "required_skills": {"communication": 7},
    "priority": 3,
    "start_datetime": "2025-11-17T09:00:00",
    "end_datetime": "2025-11-17T17:00:00"
  }'

# Search employees
curl -X POST "http://localhost:8000/search-employees" \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "123",
    "task_type": "customer_support",
    "duration_minutes": 30,
    "required_skills": "{\"communication\": 7}",
    "priority": 3,
    "start_datetime": "2025-11-17T09:00:00",
    "end_datetime": "2025-11-17T17:00:00"
  }'
```

### **3. Setup Qdrant (First Time)**

```bash
# Set environment variables
$env:QDRANT_URL="your-url"
$env:QDRANT_API_KEY="your-key"

# Setup collections
python scripts/setup_qdrant.py

# Embed employees
python scripts/embed_employees.py

# Embed tasks
python scripts/embed_tasks.py
```

---

## 📊 Data Flow

### **Employee Embedding Flow**
```
employees.csv → embed_employees.py → Qdrant "employees" collection
```

**Embedding Text Format**:
```
"Employee with skills {skills_json}, certifications {certs_json}, performance rating {rating}"
```

### **Task Embedding Flow**
```
historical_tasks.csv → embed_tasks.py → Qdrant "tasks" collection
```

**Embedding Text Format**:
```
"Task of type {task_type} requiring skills {skills_json} with duration {duration} minutes"
```

### **Search Flow**
```
Task Requirements → Embedding → Qdrant Search → Top N Employees
```

---

## 🧪 Testing

### **Test Suite (`test_application.py`)**
- Tests module imports
- Checks environment variables
- Tests AI engine functionality (if env vars set)

### **Qdrant-Only Test (`test_qdrant_only.py`)**
- Tests Qdrant search without Gemini dependency

### **Run Tests**
```bash
python test_application.py
python test_qdrant_only.py
python backend/ai/analyze_and_match.py  # Direct AI engine test
```

---

## 🔐 Environment Variables

**Required**:
- `QDRANT_URL`: Qdrant Cloud cluster URL
- `QDRANT_API_KEY`: Qdrant API key
- `GEMINI_API_KEY`: Google Gemini API key

**Optional**:
- `OPUS_API_KEY`: For Opus platform integration

**Setup**:
```powershell
$env:QDRANT_URL="https://your-cluster.qdrant.io"
$env:QDRANT_API_KEY="your-api-key"
$env:GEMINI_API_KEY="your-gemini-key"
```

Or use `.env` file with `python-dotenv` (see `example.env`)

---

## 📦 Dependencies

**Core**:
- `fastapi>=0.104.0`: Web framework
- `uvicorn[standard]>=0.24.0`: ASGI server
- `sqlalchemy`: Database ORM
- `python-dotenv`: Environment variables
- `python-multipart`: File uploads

**AI/ML**:
- `google-generativeai>=0.3.0`: Gemini API
- `sentence-transformers>=2.2.0`: Embeddings
- `qdrant-client>=1.7.0`: Vector database

**Data Processing**:
- `pandas>=2.0.0`: CSV processing

---

## 🎯 Current Status

### **✅ Completed**
- AI engine with Gemini + Qdrant integration
- FastAPI REST API with multiple endpoints
- SQLite database for task storage
- Qdrant embedding pipelines
- Employee search functionality
- Task complexity analysis
- Tradeoff analysis module
- Test suites
- Documentation

### **🚧 In Progress / Planned**
- Full scheduling algorithm integration
- Employee availability checking
- Frontend (React)
- Real-time scheduling updates
- Advanced tradeoff optimization
- Performance metrics and analytics

---

## 🔄 Workflow

### **Typical User Workflow**

1. **Initialize Session**: `GET /init-session` → Get session token
2. **Upload Data** (optional): `POST /upload` → Upload employees/tasks CSV
3. **Create Tasks**: `POST /create-task` → Create tasks for scheduling
4. **Search Employees**: `POST /search-employees` → Find matching employees
5. **Get Schedule**: `GET /get-schedule` → View scheduled tasks
6. **AI Analysis**: Use `analyze_and_match()` for recommendations

### **Admin/Setup Workflow**

1. Set environment variables
2. Setup Qdrant collections: `python scripts/setup_qdrant.py`
3. Embed employees: `python scripts/embed_employees.py`
4. Embed tasks: `python scripts/embed_tasks.py`
5. Start API server: `uvicorn backend.main:app --reload`

---

## 📝 Key Files Reference

| File | Purpose |
|------|---------|
| `backend/ai/analyze_and_match.py` | **Main AI engine** - Core matching logic |
| `backend/main.py` | FastAPI application and API endpoints |
| `backend/db.py` | Database models and session management |
| `backend/scheduler.py` | Task scheduling algorithm |
| `scripts/search_employees.py` | Qdrant employee search |
| `scripts/embed_employees.py` | Employee embedding pipeline |
| `scripts/embed_tasks.py` | Task embedding pipeline |
| `test_application.py` | Comprehensive test suite |
| `run_app.ps1` | Interactive application runner |

---

## 🎓 Key Concepts

### **Semantic Search**
Uses vector embeddings to find employees based on skill similarity, not exact matches. More flexible than keyword search.

### **Task Complexity Analysis**
Gemini AI analyzes tasks to determine:
- Complexity score (1-10)
- Required skill levels
- Potential challenges
- Duration estimates (optimistic, likely, pessimistic)

### **Tradeoff Analysis**
AI-driven recommendations for scheduling decisions:
- Cost vs. quality
- Coverage vs. efficiency
- Risk mitigation strategies

---

## 🚀 Quick Start Commands

```powershell
# 1. Activate venv
.\venv\Scripts\Activate.ps1

# 2. Set environment variables
$env:QDRANT_URL="your-url"
$env:QDRANT_API_KEY="your-key"
$env:GEMINI_API_KEY="your-key"

# 3. Test application
python test_application.py

# 4. Run AI engine
python backend\ai\analyze_and_match.py

# 5. Start API server
uvicorn backend.main:app --reload
```

Or use the interactive runner:
```powershell
.\run_app.ps1
```

---

## 📚 Documentation Files

- **`README.md`**: Project overview and quick start
- **`HOW_TO_RUN.md`**: Detailed run instructions
- **`SETUP_INSTRUCTIONS.md`**: Setup and configuration guide
- **`PROJECT_SUMMARY.md`**: This comprehensive summary

---

## 🔗 External Services

1. **Qdrant Cloud**: Vector database for embeddings
2. **Google Gemini API**: AI task analysis
3. **Opus Platform**: Workflow automation (optional)

---

## 💡 Future Enhancements

- Real-time scheduling updates
- Multi-objective optimization
- Employee availability calendar integration
- Performance analytics dashboard
- Mobile app interface
- Integration with HR systems
- Automated scheduling notifications
- Cost optimization algorithms

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Team**: TeamGenn

