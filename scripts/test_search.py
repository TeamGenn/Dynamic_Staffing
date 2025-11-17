from search_employees import search
from dotenv import load_dotenv

load_dotenv()


def main():
    
    task = {
        "task_id": "b4e6f1c2-8d3a-4f5e-9b2c-7d1a3e6f5b2d",
        "task_type": "data_entry",
        "duration_minutes": 50,
        "priority": 1,
        "required_skills": "{\"data_entry\": 9, \"time_management\": 7}",
        "start_datetime": "2025-11-17T12:00:00",
        "end_datetime": "2025-11-17T12:50:00"
    }

    search(task)

if __name__ == "__main__":
    main()

