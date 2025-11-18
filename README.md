# Dynamic Staffing & Scheduling Agent

An intelligent workforce management system that uses AI and semantic search to match employees with tasks, analyze task complexity, and optimize scheduling decisions.

## 🚀 Features

- **AI-Powered Task-Employee Matching**: Complete AI engine that combines Gemini complexity analysis with Qdrant semantic search to recommend optimal employee-task matches
- **Semantic Employee Search**: Uses Qdrant vector database and sentence transformers to find the best employee matches for tasks based on skills, certifications, and performance history
- **AI-Powered Task Analysis**: Leverages Google Gemini 2.0 Flash to analyze task complexity, estimate durations, and identify required skills
- **Tradeoff Analysis**: AI-driven decision making for scheduling tradeoffs (cost vs. quality, speed vs. expertise, etc.)
- **RESTful API**: FastAPI backend with automatic API documentation
- **Scalable Architecture**: Clean separation between backend, scripts, and frontend components

## 🛠️ Technology Stack

- **Backend**: FastAPI, Python 3.8+
- **Vector Database**: Qdrant Cloud
- **AI/ML**: 
  - Google Gemini 2.0 Flash API
  - Sentence Transformers (all-MiniLM-L6-v2)
- **Data Processing**: Pandas
- **Frontend**: React (to be implemented)

## 📁 Project Structure

```
Dynamic_Staffing/
├── data/                          # CSV data files
│   ├── employees.csv
│   └── historical_tasks.csv
├── backend/                       # FastAPI application
│   ├── main.py                   # FastAPI app entry point
│   ├── scheduler.py              # Scheduling logic
│   ├── search_employees.py        # Employee search functionality
│   ├── gemini_tradeoff_analysis.py # Tradeoff analysis
│   ├── ai/                        # AI engine modules
│   │   ├── analyze_and_match.py  # Main AI engine for task-employee matching
│   │   ├── gemini_task_complexity.py # Task complexity analysis
│   │   └── gemini_tradeoff_analysis.py # Tradeoff analysis
│   ├── models/                   # Data models
│   ├── routes/                   # API routes
│   └── utils/                    # Utility functions
├── scripts/                       # Utility scripts
│   ├── qdrant_setup.py          # Qdrant collection setup
│   ├── embed_employees.py       # Employee embedding pipeline
│   ├── embed_tasks.py           # Task embedding pipeline
│   ├── test_search.py           # Search testing
│   └── ...                      # Data generation & transformation scripts
├── frontend/                     # React frontend (to be implemented)
├── requirements.txt
├── SETUP_INSTRUCTIONS.md         # Detailed setup guide
└── README.md                     # This file
```

## ⚡ Quick Start

### Prerequisites

- Python 3.8 or higher
- Qdrant Cloud account (free tier available)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TeamGenn/Dynamic_Staffing.git
   cd Dynamic_Staffing
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables**
   
   Windows (PowerShell):
   ```powershell
   $env:QDRANT_URL="your-qdrant-cloud-url"
   $env:QDRANT_API_KEY="your-api-key"
   $env:GEMINI_API_KEY="your-gemini-api-key"
   ```
   
   Linux/Mac:
   ```bash
   export QDRANT_URL="your-qdrant-cloud-url"
   export QDRANT_API_KEY="your-api-key"
   export GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Run the embedding pipeline** (only if setting up Qdrant from scratch)
   
   **Skip this if you already have Qdrant Cloud configured with data.**
   
   ```bash
   python scripts/qdrant_setup.py
   python scripts/embed_employees.py
   python scripts/embed_tasks.py
   ```

5. **Start the API server**
   ```bash
   uvicorn backend.main:app --reload
   ```

6. **Access the API**
   - API: http://localhost:8000
   - Health check: http://localhost:8000/health
   - Interactive docs: http://localhost:8000/docs

## 📚 Documentation

For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md).

## 🔧 API Endpoints

### Health Check
```
GET /health
```
Returns API status.

## 🤖 AI Engine Usage

### Main AI Matching Engine

The `analyze_and_match` function is the core AI engine that combines task complexity analysis with employee matching:

```python
from backend.ai.analyze_and_match import analyze_and_match

# Example task payload
task_payload = {
    "task_type": "phone_support",
    "description": "Handle incoming customer calls and resolve technical issues",
    "required_skills": {
        "communication": 7,
        "customer_service": 5,
        "technical_support": 6
    },
    "priority": 2
}

# Get AI analysis and recommendations
result = analyze_and_match(task_payload)

# Result structure:
# {
#   "complexity_analysis": {
#     "complexity_score": 7,
#     "recommended_skills": {...},
#     "challenges": [...],
#     "duration_estimate": {...}
#   },
#   "top_employees": [
#     {"employee_name": "Alice", "score": 0.76},
#     {"employee_name": "Michael", "score": 0.71}
#   ],
#   "recommendation_summary": "This is a high-complexity task..."
# }
```

### How It Works

1. **Step 1 - Complexity Analysis**: Uses Google Gemini 2.0 Flash to analyze task complexity, estimate duration, and identify challenges
2. **Step 2 - Employee Search**: Searches Qdrant vector database using semantic embeddings to find top matching employees
3. **Step 3 - Recommendation**: Combines complexity analysis with employee matches to generate actionable recommendations

### Testing the AI Engine

You can test the AI engine directly:

```bash
python backend/ai/analyze_and_match.py
```

This will run a test with a sample task and display the results.


## 🤝 Contributing

This is a hackathon project by TeamGenn. Contributions and improvements are welcome!

## 📝 License

## 👥 Team

TeamGenn - Dynamic Staffing & Scheduling Agent

---

**Note**: This project is under active development. Some features may be in progress or planned for future releases.

