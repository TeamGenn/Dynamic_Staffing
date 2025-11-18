import os
import json
import google.generativeai as genai

def analyze_task_complexity(task_type, description, avg_duration, skills, priority):
    api_key = os.environ.get("AIzaSyA_Nz1WRKUum8VEVzz1PyTOyBaluaswCZU")
    if not api_key:
        raise ValueError("GEMINI_API_KEY must be set in environment variables")
    
    genai.configure(api_key=api_key)
    
    if isinstance(skills, dict):
        skills_str = ", ".join([f"{k}: {v}" for k, v in skills.items()])
    elif isinstance(skills, list):
        skills_str = ", ".join(skills)
    else:
        skills_str = str(skills)
    
    prompt = f"""You are a workforce planning AI assistant. Analyze the following task and provide a detailed assessment.

Task Information:

- Task Type: {task_type}

- Description: {description}

- Historical Average Duration: {avg_duration} minutes

- Required Skills: {skills_str}

- Priority Level: {priority}

Provide your analysis in the following JSON format:

{{
  "complexity_score": <1-10>,
  "recommended_skills": {{
    "skill_name": <required_level_1-10>
  }},
  "challenges": ["challenge1", "challenge2"],
  "duration_estimate": {{
    "optimistic": <minutes>,
    "likely": <minutes>,
    "pessimistic": <minutes>,
    "confidence": <0.0-1.0>
  }}
}}

Your response must be ONLY valid JSON. Do not include any text before or after the JSON object."""
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content(prompt)
        
        if not hasattr(response, 'text') or not response.text:
            raise RuntimeError("Gemini API returned empty or invalid response")
        
        response_text = response.text.strip()
        
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

