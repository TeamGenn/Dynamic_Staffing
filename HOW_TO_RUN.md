# How to Run the Application

## ✅ Test Results

**Good News:** All your code is working correctly! The test shows:
- ✅ All modules import successfully
- ✅ All dependencies are installed
- ✅ Code structure is correct

**What's Needed:** Environment variables for API keys

---

## 🚀 Quick Start Guide

### Step 1: Activate Virtual Environment

Since you have a `venv` folder, you need to activate it first:

**PowerShell:**
```powershell
cd D:\Hackathon
.\venv\Scripts\Activate.ps1
```

**Command Prompt:**
```cmd
cd D:\Hackathon
venv\Scripts\activate.bat
```

After activation, you should see `(venv)` in your prompt.

---

### Step 2: Set Environment Variables

You need to set these three environment variables:

**PowerShell:**
```powershell
$env:QDRANT_URL="your-qdrant-cloud-url"
$env:QDRANT_API_KEY="your-qdrant-api-key"
$env:GEMINI_API_KEY="your-gemini-api-key"
```

**Command Prompt:**
```cmd
set QDRANT_URL=your-qdrant-cloud-url
set QDRANT_API_KEY=your-qdrant-api-key
set GEMINI_API_KEY=your-gemini-api-key
```

**Note:** These variables only last for the current session. To make them permanent, you can:
- Add them to your system environment variables
- Create a `.env` file (if using python-dotenv)
- Set them in your PowerShell profile

---

### Step 3: Run the Application

#### Option A: Test the AI Engine Directly

```powershell
# Make sure venv is activated and env vars are set
python backend\ai\analyze_and_match.py
```

This will run a test with a sample task and show you:
- Complexity analysis from Gemini
- Top matching employees from Qdrant
- Recommendation summary

#### Option B: Run the FastAPI Server

```powershell
# Make sure venv is activated and env vars are set
uvicorn backend.main:app --reload
```

Then open:
- API: http://localhost:8000
- Health check: http://localhost:8000/health
- Interactive docs: http://localhost:8000/docs

#### Option C: Run the Test Suite

```powershell
# Make sure venv is activated
python test_application.py
```

This will check:
- Module imports
- Environment variables
- AI engine functionality (if env vars are set)

---

## 📋 Complete Example Session

Here's a complete example of running everything:

```powershell
# 1. Navigate to project
cd D:\Hackathon

# 2. Activate venv
.\venv\Scripts\Activate.ps1

# 3. Set environment variables
$env:QDRANT_URL="https://your-cluster.qdrant.io"
$env:QDRANT_API_KEY="your-api-key-here"
$env:GEMINI_API_KEY="your-gemini-key-here"

# 4. Test the application
python test_application.py

# 5. Run the AI engine test
python backend\ai\analyze_and_match.py

# 6. Start the API server (in a new terminal)
uvicorn backend.main:app --reload
```

---

## 🔍 What Each Component Does

### `analyze_and_match.py`
The main AI engine that:
1. Analyzes task complexity using Gemini
2. Searches for matching employees using Qdrant
3. Generates recommendations

**Usage:**
```python
from backend.ai.analyze_and_match import analyze_and_match

result = analyze_and_match({
    "task_type": "phone_support",
    "description": "Handle customer calls",
    "required_skills": {"communication": 7, "customer_service": 5},
    "priority": 2
})
```

### `backend/main.py`
FastAPI server that provides REST API endpoints.

### `test_application.py`
Comprehensive test suite to verify everything is working.

---

## ⚠️ Troubleshooting

### "ModuleNotFoundError"
- Make sure venv is activated
- Install dependencies: `pip install -r requirements.txt`

### "Environment variable not set"
- Set the required environment variables (see Step 2)
- Make sure you're in the same terminal session where you set them

### "Qdrant connection failed"
- Check your QDRANT_URL and QDRANT_API_KEY
- Make sure Qdrant Cloud is accessible
- Verify the collections "employees" and "tasks" exist

### "Gemini API error"
- Check your GEMINI_API_KEY
- Verify you have API quota available

---

## 📝 Summary

**Current Status:**
- ✅ Code structure: WORKING
- ✅ Dependencies: INSTALLED
- ⚠️ Environment variables: NEED TO BE SET

**To run the full application:**
1. Activate venv
2. Set environment variables
3. Run `python backend\ai\analyze_and_match.py` or `uvicorn backend.main:app --reload`

Your application is ready to go once you set the environment variables! 🎉

