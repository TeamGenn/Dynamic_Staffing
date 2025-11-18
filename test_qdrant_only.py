"""Test Qdrant employee search without Gemini"""
import os
import sys

# Add project root to path
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.ai.analyze_and_match import search_employees

# Test Qdrant search
print("Testing Qdrant employee search...")
print("=" * 60)

try:
    required_skills = {
        "communication": 7,
        "customer_service": 5,
        "technical_support": 6
    }
    
    employees = search_employees(required_skills, limit=5)
    
    print(f"[OK] Found {len(employees)} employees!")
    print("\nTop matches:")
    for i, emp in enumerate(employees, 1):
        print(f"  {i}. {emp['employee_name']} - Score: {emp['score']:.4f}")
    
except Exception as e:
    print(f"[FAIL] Error: {e}")
    import traceback
    traceback.print_exc()

