"""
Test script to verify the application setup and functionality.
Run this from the project root with: venv\Scripts\python.exe test_application.py
"""

import os
import sys

def test_imports():
    """Test if all modules can be imported"""
    print("=" * 60)
    print("TEST 1: Testing Module Imports")
    print("=" * 60)
    
    try:
        from backend.ai.analyze_and_match import analyze_and_match
        print("[OK] analyze_and_match module imported successfully")
    except Exception as e:
        print(f"[FAIL] Failed to import analyze_and_match: {e}")
        return False
    
    try:
        from backend.ai.gemini_task_complexity import analyze_task_complexity
        print("[OK] gemini_task_complexity module imported successfully")
    except Exception as e:
        print(f"[FAIL] Failed to import gemini_task_complexity: {e}")
        return False
    
    try:
        from backend.main import app
        print("[OK] FastAPI app imported successfully")
    except Exception as e:
        print(f"[FAIL] Failed to import FastAPI app: {e}")
        return False
    
    print()
    return True

def test_environment_variables():
    """Check if required environment variables are set"""
    print("=" * 60)
    print("TEST 2: Checking Environment Variables")
    print("=" * 60)
    
    required_vars = {
        "QDRANT_URL": os.environ.get("QDRANT_URL"),
        "QDRANT_API_KEY": os.environ.get("QDRANT_API_KEY"),
        "GEMINI_API_KEY": os.environ.get("GEMINI_API_KEY")
    }
    
    all_set = True
    for var_name, var_value in required_vars.items():
        if var_value:
            print(f"[OK] {var_name}: SET")
        else:
            print(f"[MISSING] {var_name}: NOT SET (required for full functionality)")
            all_set = False
    
    print()
    return all_set

def test_ai_engine():
    """Test the AI engine (requires environment variables)"""
    print("=" * 60)
    print("TEST 3: Testing AI Engine (analyze_and_match)")
    print("=" * 60)
    
    if not os.environ.get("QDRANT_URL") or not os.environ.get("QDRANT_API_KEY"):
        print("[SKIP] Skipping: QDRANT_URL and QDRANT_API_KEY not set")
        print()
        return False
    
    if not os.environ.get("GEMINI_API_KEY"):
        print("[SKIP] Skipping: GEMINI_API_KEY not set")
        print()
        return False
    
    try:
        from backend.ai.analyze_and_match import analyze_and_match
        
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
        
        print("Running analyze_and_match with test task...")
        result = analyze_and_match(test_task)
        
        print("[OK] AI Engine test PASSED!")
        print(f"   - Complexity score: {result['complexity_analysis'].get('complexity_score', 'N/A')}")
        print(f"   - Top employees found: {len(result['top_employees'])}")
        print(f"   - Recommendation: {result['recommendation_summary'][:80]}...")
        print()
        return True
        
    except Exception as e:
        print(f"[FAIL] AI Engine test FAILED: {e}")
        import traceback
        traceback.print_exc()
        print()
        return False

def main():
    print("\n" + "=" * 60)
    print("APPLICATION TEST SUITE")
    print("=" * 60 + "\n")
    
    # Test 1: Imports
    imports_ok = test_imports()
    
    # Test 2: Environment variables
    env_ok = test_environment_variables()
    
    # Test 3: AI Engine (only if env vars are set)
    ai_ok = test_ai_engine()
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Module Imports: {'[PASS]' if imports_ok else '[FAIL]'}")
    print(f"Environment Variables: {'[ALL SET]' if env_ok else '[NOT ALL SET]'}")
    print(f"AI Engine Test: {'[PASS]' if ai_ok else '[SKIPPED or FAILED]'}")
    print()
    
    if imports_ok:
        print("[OK] Your application code is ready!")
        if not env_ok:
            print("\n[INFO] To run the full application, you need to set environment variables:")
            print("   PowerShell:")
            print('   $env:QDRANT_URL="your-qdrant-url"')
            print('   $env:QDRANT_API_KEY="your-api-key"')
            print('   $env:GEMINI_API_KEY="your-gemini-key"')
            print("\n   Then run: venv\\Scripts\\python.exe backend\\ai\\analyze_and_match.py")
        else:
            print("[OK] Everything is set up correctly!")
    else:
        print("[FAIL] Please fix import errors before proceeding.")
    
    print()

if __name__ == "__main__":
    main()

