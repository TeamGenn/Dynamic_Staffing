"""
AI Engine for Backend Scheduling Workflow

This module provides the main AI analysis and matching functionality that combines
Gemini task complexity analysis with Qdrant employee search to recommend optimal
task-employee matches.
"""

import os
import sys
import json
from typing import Dict, List, Any, Optional
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

# Add project root to path for imports
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.ai.gemini_task_complexity import analyze_task_complexity


def search_employees(required_skills: Dict[str, int], limit: int = 10) -> List[Dict[str, Any]]:
    """
    Search Qdrant for top matching employees based on required skills.
    
    Args:
        required_skills: Dictionary mapping skill names to required levels (1-10)
        limit: Maximum number of employees to return (default: 10)
    
    Returns:
        List of dictionaries with 'employee_name' and 'score' keys, sorted by score descending
    
    Raises:
        ValueError: If Qdrant environment variables are not set
        RuntimeError: If Qdrant search fails
    """
    qdrant_url = os.environ.get("QDRANT_URL")
    qdrant_api_key = os.environ.get("QDRANT_API_KEY")
    
    if not qdrant_url or not qdrant_api_key:
        raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in environment variables")
    
    try:
        # Initialize Qdrant client
        client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
        
        # Initialize embedding model
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        
        # Convert required skills dict to text format for embedding
        # Format: "communication:7, customer_service:5"
        skills_text = ", ".join([f"{k}:{v}" for k, v in required_skills.items()])
        
        # Generate embedding
        query_text = f"Task requiring skills {skills_text}"
        embedding = model.encode(query_text).tolist()
        
        # Query Qdrant using the new query_points method
        query_response = client.query_points(
            collection_name="employees",
            query=embedding,
            limit=limit
        )
        
        # Format results
        ranked_employees = []
        for point in query_response.points:
            employee_name = point.payload.get("name", "Unknown")
            score = float(point.score)
            ranked_employees.append({
                "employee_name": employee_name,
                "score": score
            })
        
        return ranked_employees
        
    except Exception as e:
        raise RuntimeError(f"Qdrant employee search failed: {e}")


def generate_recommendation_summary(
    complexity_analysis: Dict[str, Any],
    top_employees: List[Dict[str, Any]]
) -> str:
    """
    Generate a text summary recommendation based on complexity analysis and employee matches.
    
    Args:
        complexity_analysis: The complexity analysis result from Gemini
        top_employees: List of top matching employees with scores
    
    Returns:
        A short text summary with recommendations
    """
    complexity_score = complexity_analysis.get("complexity_score", 5)
    
    # Check if we have any employees
    if not top_employees:
        return "No matching employees found. Consider expanding skill requirements or hiring additional staff."
    
    # Get top employee score
    top_score = top_employees[0].get("score", 0.0) if top_employees else 0.0
    top_employee_name = top_employees[0].get("employee_name", "Unknown") if top_employees else "Unknown"
    
    # Build summary based on complexity and match quality
    summary_parts = []
    
    # Complexity assessment
    if complexity_score > 7:
        summary_parts.append(f"This is a high-complexity task (score: {complexity_score}/10).")
    elif complexity_score < 4:
        summary_parts.append(f"This is a low-complexity task (score: {complexity_score}/10).")
    else:
        summary_parts.append(f"This is a moderate-complexity task (score: {complexity_score}/10).")
    
    # Match quality assessment
    if top_score < 0.60:
        summary_parts.append("No strong employee matches found (top match score < 0.60).")
        summary_parts.append("Consider training existing staff or adjusting task requirements.")
    else:
        # Recommend top employees
        if len(top_employees) >= 2:
            second_employee = top_employees[1].get("employee_name", "Unknown")
            second_score = top_employees[1].get("score", 0.0)
            summary_parts.append(
                f"Top recommendation: {top_employee_name} (match score: {top_score:.2f}). "
                f"Alternative: {second_employee} (match score: {second_score:.2f})."
            )
        else:
            summary_parts.append(
                f"Top recommendation: {top_employee_name} (match score: {top_score:.2f})."
            )
    
    return " ".join(summary_parts)


def analyze_and_match(task_payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main AI engine function that analyzes task complexity and matches with employees.
    
    This function performs three steps:
    1. Analyzes task complexity using Gemini AI
    2. Searches Qdrant for top matching employees
    3. Combines results into a recommendation summary
    
    Args:
        task_payload: Dictionary containing:
            - task_type: str - Type of task (e.g., "phone_support")
            - description: str - Task description
            - required_skills: dict - Dictionary mapping skill names to levels (1-10)
            - priority: int - Priority level (optional, defaults to 3)
    
    Returns:
        Dictionary containing:
            - complexity_analysis: dict - Full complexity analysis from Gemini
            - top_employees: list - List of top matching employees with scores
            - recommendation_summary: str - Text summary with recommendations
    
    Raises:
        ValueError: If required fields are missing or invalid
        RuntimeError: If AI analysis or search fails
    """
    # Validate required fields
    if "task_type" not in task_payload:
        raise ValueError("task_payload must contain 'task_type' field")
    
    if "required_skills" not in task_payload:
        raise ValueError("task_payload must contain 'required_skills' field")
    
    if not isinstance(task_payload["required_skills"], dict):
        raise ValueError("required_skills must be a dictionary")
    
    # Extract task information
    task_type = task_payload["task_type"]
    description = task_payload.get("description", "")
    required_skills = task_payload["required_skills"]
    priority = task_payload.get("priority", 3)
    
    # STEP 1: Call Gemini Complexity Module
    try:
        complexity = analyze_task_complexity(
            task_type=task_type,
            description=description,
            avg_duration=None,  # Leave as None for now
            skills=required_skills,
            priority=priority
        )
    except Exception as e:
        raise RuntimeError(f"Gemini complexity analysis failed: {e}")
    
    # STEP 2: Search Qdrant for Top Employees
    try:
        ranked_employees = search_employees(required_skills=required_skills, limit=10)
    except Exception as e:
        raise RuntimeError(f"Employee search failed: {e}")
    
    # STEP 3: Combine Complexity + Qdrant Ranking
    recommendation_summary = generate_recommendation_summary(
        complexity_analysis=complexity,
        top_employees=ranked_employees
    )
    
    return {
        "complexity_analysis": complexity,
        "top_employees": ranked_employees,
        "recommendation_summary": recommendation_summary
    }


if __name__ == "__main__":
    # Simple test with a fake task
    print("Testing analyze_and_match with sample task...")
    print("-" * 60)
    
    test_task = {
        "task_type": "phone_support",
        "description": "Handle incoming customer calls and resolve technical issues",
        "required_skills": {
            "communication": 7,
            "customer_service": 5,
            "technical_support": 6
        },
        "priority": 2
    }
    
    try:
        result = analyze_and_match(test_task)
        
        print("\n[OK] Analysis completed successfully!")
        print("\nComplexity Analysis:")
        print(json.dumps(result["complexity_analysis"], indent=2))
        
        print("\n\nTop Employees:")
        for i, employee in enumerate(result["top_employees"][:5], 1):
            print(f"  {i}. {employee['employee_name']} - Score: {employee['score']:.4f}")
        
        print("\n\nRecommendation Summary:")
        print(f"  {result['recommendation_summary']}")
        
    except Exception as e:
        print(f"\n[FAIL] Test failed: {e}")
        import traceback
        traceback.print_exc()

