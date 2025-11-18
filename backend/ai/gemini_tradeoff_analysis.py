import os
import json
import google.generativeai as genai

def analyze_tradeoffs(schedule_json, budget, coverage_percentage, availability_constraints, detected_issues):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY must be set in environment variables")
    
    genai.configure(api_key=api_key)
    
    # Format inputs for the prompt
    if isinstance(schedule_json, dict):
        schedule_str = json.dumps(schedule_json, indent=2)
    else:
        schedule_str = str(schedule_json)
    
    if isinstance(availability_constraints, dict):
        availability_str = json.dumps(availability_constraints, indent=2)
    else:
        availability_str = str(availability_constraints)
    
    if isinstance(detected_issues, list):
        issues_str = json.dumps(detected_issues, indent=2)
    elif isinstance(detected_issues, dict):
        issues_str = json.dumps(detected_issues, indent=2)
    else:
        issues_str = str(detected_issues)
    
    prompt = f"""You are an operations optimization AI. Review the current schedule and constraints, then provide recommendations with trade-off analysis.

Current Schedule:

{schedule_str}

Constraints:

- Cost Budget: ${budget}

- Required Coverage: {coverage_percentage}%

- Employee Availability: {availability_str}

Issues Detected:

{issues_str}

Provide your analysis in the following JSON format:

{{
  "recommendations": [
    {{
      "action": "Specific action to take",
      "rationale": "Why this helps",
      "cost_impact": "$XX or percentage",
      "risk_reduction": "XX% or description",
      "priority": <1-5>,
      "confidence": <0.0-1.0>
    }}
  ],
  "alerts": [
    {{
      "severity": "low|medium|high",
      "message": "Description of issue",
      "affected_time_slots": ["time1", "time2"]
    }}
  ]
}}

Your response must be ONLY valid JSON."""
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content(prompt)
        
        if not hasattr(response, 'text') or not response.text:
            raise RuntimeError("Gemini API returned empty or invalid response")
        
        response_text = response.text.strip()
        
        # Remove markdown code block wrappers
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        result = json.loads(response_text)
        return result
        
    except json.JSONDecodeError as e:
        response_preview = response_text[:200] if 'response_text' in locals() else "N/A"
        raise ValueError(f"Failed to parse JSON response from Gemini: {e}. Response: {response_preview}")
    except Exception as e:
        raise RuntimeError(f"Gemini API call failed: {e}")


def run_tradeoff_test():
    """Simple test function that prints the model output using mock input."""
    mock_schedule = {
        "monday": [
            {"time": "09:00-17:00", "employee": "John Doe", "task": "Customer Service"},
            {"time": "10:00-18:00", "employee": "Jane Smith", "task": "Sales"}
        ],
        "tuesday": [
            {"time": "09:00-17:00", "employee": "John Doe", "task": "Customer Service"}
        ]
    }
    
    mock_budget = 5000.0
    mock_coverage = 85
    mock_availability = {
        "John Doe": ["monday", "tuesday", "wednesday"],
        "Jane Smith": ["monday", "friday"]
    }
    mock_issues = [
        {
            "type": "understaffed",
            "time_slot": "tuesday 14:00-16:00",
            "severity": "medium"
        },
        {
            "type": "overtime_risk",
            "employee": "John Doe",
            "hours": 42
        }
    ]
    
    try:
        result = analyze_tradeoffs(
            schedule_json=mock_schedule,
            budget=mock_budget,
            coverage_percentage=mock_coverage,
            availability_constraints=mock_availability,
            detected_issues=mock_issues
        )
        
        print("Trade-off Analysis Result:")
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(f"Test failed with error: {e}")


if __name__ == "__main__":
    run_tradeoff_test()
