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
