import os
import json
import google.generativeai as genai

def analyze_task_complexity(task_type, description, avg_duration, skills, priority):
    """
    Analyze task complexity using Gemini 2.0 Flash API.
    
    Args:
        task_type: Type of the task
        description: Task description
        avg_duration: Historical average duration in minutes
        skills: Required skills (dict or list)
        priority: Priority level
    
    Returns:
        dict: Parsed JSON response with complexity analysis
    """
    # Get API key from environment
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY must be set in environment variables")
    
    # Configure Gemini client
    genai.configure(api_key=api_key)
    
    # Format skills for prompt
    if isinstance(skills, dict):
        skills_str = ", ".join([f"{k}: {v}" for k, v in skills.items()])
    elif isinstance(skills, list):
        skills_str = ", ".join(skills)
    else:
        skills_str = str(skills)
    
    # Build the prompt template
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
        # Initialize Gemini 2.0 Flash model
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Generate response
        response = model.generate_content(prompt)
        
        # Extract text from response
        if not hasattr(response, 'text') or not response.text:
            raise RuntimeError("Gemini API returned empty or invalid response")
        
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        # Parse JSON
        result = json.loads(response_text)
        return result
        
    except json.JSONDecodeError as e:
        response_preview = response_text[:200] if 'response_text' in locals() else "N/A"
        raise ValueError(f"Failed to parse JSON response from Gemini: {e}. Response: {response_preview}")
    except Exception as e:
        raise RuntimeError(f"Gemini API call failed: {e}")

