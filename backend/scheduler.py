from datetime import datetime

def schedule(tasks):
    """
    Sort tasks on the basis of priority (descending) and deadline (ascending).
    
    Args:
        tasks: List of task dictionaries with 'priority' and 'end_datetime' keys
        
    Returns:
        List of tasks sorted by priority (high to low) and deadline (early to late)
    """
    # Handle both datetime objects and ISO strings
    for task in tasks:
        if isinstance(task["end_datetime"], str):
            task["end_datetime"] = datetime.fromisoformat(task["end_datetime"])

    tasks_sorted = sorted(
        tasks,
        key=lambda t: (-t["priority"], t["end_datetime"])
    )

    return tasks_sorted