from datetime import datetime

def schedule(tasks):

    # Sort tasks on the basis of priority and deadline

    for task in tasks:

        task["end_datetime"] = datetime.fromisoformat(task["end_datetime"])

    tasks_sorted = sorted(
        tasks,
        key=lambda t: (-t["priority"], t["end_datetime"])
    )

    for t in tasks_sorted:

        print(t["task_id"], t["priority"], t["end_datetime"])

tasks = [
    {"task_id": 1, "priority": 3, "end_datetime": "2025-11-18T12:00:00"},
    {"task_id": 2, "priority": 5, "end_datetime": "2025-11-17T10:00:00"},
    {"task_id": 3, "priority": 5, "end_datetime": "2025-11-16T09:00:00"},
    {"task_id": 4, "priority": 2, "end_datetime": "2025-11-19T15:00:00"},
]

schedule(
tasks=tasks
)