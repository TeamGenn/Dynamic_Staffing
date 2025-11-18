# Dynamic Staffing & Scheduling Agent

An intelligent workforce management system that uses AI and semantic search to match employees with tasks, analyze task complexity, and optimize scheduling decisions.

## 🚀 Features

- **AI-Powered Task-Employee Matching**: Complete AI engine that combines Gemini complexity analysis with Qdrant semantic search to recommend optimal employee-task matches
- **Semantic Employee Search**: Uses Qdrant vector database and sentence transformers to find the best employee matches for tasks based on skills, certifications, and performance history
- **AI-Powered Task Analysis**: Leverages Google Gemini 2.0 Flash to analyze task complexity, estimate durations, and identify required skills
- **Smart Scheduling**: Priority-based task scheduling with deadline optimization
- **Interactive Web Interface**: Modern Next.js frontend with drag-and-drop file uploads, task creation, and visual schedule grid
- **RESTful API**: FastAPI backend with automatic API documentation
- **Production Ready**: Graceful degradation works even without Qdrant/Gemini configured

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: SQLite (with SQLAlchemy ORM)
- **Vector Database**: Qdrant Cloud
- **AI/ML**: 
  - Google Gemini 2.0 Flash API
  - Sentence Transformers (all-MiniLM-L6-v2)
- **Data Processing**: Pandas

### Frontend
- **Framework**: Next.js 16 with React 19
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Notifications**: Sonner (toast notifications)

## 📁 Project Structure

```
Dynamic_Staffing/
├── backend/                       # FastAPI application
│   ├── main.py                   # FastAPI app entry point & API endpoints
│   ├── scheduler.py              # Task scheduling logic
│   ├── db.py                     # Database models and session
│   └── ai/                       # AI engine modules
│       ├── analyze_and_match.py  # Main AI engine for task-employee matching
│       ├── gemini_task_complexity.py # Task complexity analysis
│       └── gemini_tradeoff_analysis.py # Tradeoff analysis
├── scripts/                       # Utility scripts
│   ├── embed_employees.py        # Employee embedding pipeline
│   └── embed_tasks.py           # Task embedding pipeline
├── frontend/                     # Next.js frontend
│   ├── app/                      # Next.js app router pages
│   │   ├── page.tsx             # Landing page
│   │   ├── intake/              # File upload & task creation
│   │   └── review/              # Schedule review & approval
│   ├── components/              # React components
│   ├── lib/                     # Utilities & API client
│   └── package.json
├── data/                         # CSV data files
│   ├── employees.csv
│   └── historical_tasks.csv
├── Procfile                      # Railway deployment config
├── requirements.txt             # Python dependencies
└── README.md                     # This file
```

## ⚡ Quick Start

### Prerequisites

- **Python 3.11+** installed
- **Node.js 18+** and **npm** installed
- **Qdrant Cloud account** (free tier available) - Optional for demo mode
- **Google Gemini API key** - Optional for demo mode

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dynamic_Staffing
   ```

2. **Set up Backend**

   Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   
   # Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   
   # Windows (Command Prompt)
   venv\Scripts\activate.bat
   
   # Linux/Mac
   source venv/bin/activate
   ```

   Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Frontend**

   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

#### Backend Environment Variables

Create a `.env` file in the root directory or set environment variables:

**Windows (PowerShell):**
```powershell
$env:QDRANT_URL="your-qdrant-cloud-url"
$env:QDRANT_API_KEY="your-qdrant-api-key"
$env:GEMINI_API_KEY="your-gemini-api-key"
$env:CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

**Linux/Mac:**
```bash
export QDRANT_URL="your-qdrant-cloud-url"
export QDRANT_API_KEY="your-qdrant-api-key"
export QDRANT_API_KEY="your-gemini-api-key"
export CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

**Note:** The application works in demo mode even without Qdrant/Gemini configured. File uploads will succeed but embeddings will be skipped.

#### Frontend Environment Variables

Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the Application

#### Start Backend Server

```bash
# Make sure virtual environment is activated
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Interactive Docs**: http://localhost:8000/docs

#### Start Frontend Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at:
- **Frontend**: http://localhost:3000

## 📚 Usage Guide

### 1. Upload Employee & Task Data

- Navigate to the intake page
- Upload CSV files containing:
  - **Employee profiles**: Name, skills, certifications, performance history
  - **Historical tasks**: Task types, durations, required skills
- Files are processed and embedded into Qdrant (if configured)

### 2. Create Tasks

- Define new tasks with:
  - Task type and description
  - Required skills and skill levels (1-10)
  - Priority (1-5)
  - Start and end datetime
  - Duration

### 3. Generate Schedule

- Review queued tasks
- Click "Start Scheduling" to generate optimized schedule
- Tasks are sorted by priority and deadline

### 4. Review & Approve

- View weekly schedule grid with colorful task blocks
- Review AI recommendations and tradeoffs
- Export schedule as CSV or PDF
- Finalize and approve schedule

## 🔧 API Endpoints

### Health Check
```
GET /health
```
Returns API status.

### Session Management
```
GET /init-session
```
Initializes a new session and returns a session token (cookie-based).

### File Upload
```
POST /upload
```
Upload CSV files (employees_profiles or historical_tasks).

**Form Data:**
- `file`: CSV file
- `data_type`: "employees_profiles" or "historical_tasks"

### Task Management
```
POST /create-task
```
Create a new task.

**Request Body:**
```json
{
  "task_type": "product_inquiry",
  "duration_minutes": 120,
  "required_skills": {"communication": 7, "customer_service": 5},
  "priority": 2,
  "start_datetime": "2025-11-20T09:00:00",
  "end_datetime": "2025-11-20T17:00:00"
}
```

### Get Schedule
```
GET /get-schedule
```
Retrieve scheduled tasks for the current session.

### Search Employees
```
POST /search-employees
```
AI-powered employee search matching task requirements.

## 🤖 AI Engine

### Main AI Matching Engine

The `analyze_and_match` function combines task complexity analysis with employee matching:

```python
from backend.ai.analyze_and_match import analyze_and_match

task_payload = {
    "task_type": "phone_support",
    "description": "Handle incoming customer calls",
    "required_skills": {
        "communication": 7,
        "customer_service": 5
    },
    "priority": 2
}

result = analyze_and_match(task_payload)
```

**Result Structure:**
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
        {"employee_name": "Michael", "score": 0.71}
    ],
    "recommendation_summary": "This is a high-complexity task..."
}
```

### How It Works

1. **Complexity Analysis**: Uses Google Gemini 2.0 Flash to analyze task complexity
2. **Employee Search**: Searches Qdrant vector database using semantic embeddings
3. **Recommendation**: Combines analysis with matches to generate recommendations

### Testing the AI Engine

```bash
python backend/ai/analyze_and_match.py
```

## 🚀 Deployment

### Railway (Backend)

1. Connect GitHub repository to Railway
2. Railway will auto-detect `Procfile`
3. Set environment variables in Railway dashboard:
   - `QDRANT_URL`
   - `QDRANT_API_KEY`
   - `GEMINI_API_KEY`
   - `CORS_ORIGINS` (your frontend URL)
   - `PORT` (auto-set by Railway)

### Vercel/Netlify (Frontend)

1. Connect GitHub repository
2. Set environment variable:
   - `NEXT_PUBLIC_API_URL` (your Railway backend URL)
3. Build and deploy

## 🧪 Testing

Run the test suite:
```bash
python test_application.py
```

This will verify:
- All modules import correctly
- Environment variables are set
- AI engine functionality (if configured)

## 📝 Development

### Backend Development

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate     # Linux/Mac

# Run with auto-reload
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
# Remove --reload flag for production
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## ⚠️ Troubleshooting

### Backend Issues

**"ModuleNotFoundError"**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

**"Port 8000 already in use"**
- Use a different port: `uvicorn backend.main:app --reload --port 8001`
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**"CORS error"**
- Ensure `CORS_ORIGINS` includes your frontend URL
- Check backend terminal for CORS configuration

### Frontend Issues

**"Cannot find module"**
```bash
cd frontend
rm -r node_modules  # or Remove-Item -Recurse node_modules
npm install
```

**"API connection failed"**
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Verify CORS is configured in backend

## 🤝 Contributing

This is a hackathon project by TeamGenn. Contributions and improvements are welcome!

## 📄 License

This project is part of a hackathon submission.

## 👥 Team

**TeamGenn** - Dynamic Staffing & Scheduling Agent

---

**Note**: This project is production-ready and can be deployed. The application gracefully handles missing Qdrant/Gemini configuration, making it suitable for demo purposes.
