import csv
import json
import random

SKILLS_POOL = [
    "customer_service", "product_knowledge", "sales", "technical_support",
    "data_entry", "inventory_management", "cash_handling", "communication",
    "problem_solving", "teamwork", "time_management", "multitasking",
    "phone_etiquette", "email_communication", "documentation", "quality_control"
]

CERTIFICATIONS_POOL = [
    "register_certified", "safety_certified", "product_specialist", 
    "customer_experience", "inventory_management", "cash_handling_cert"
]

WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

NAMES = [
    "Alex Johnson", "Sarah Martinez", "Michael Chen", "Emily Rodriguez",
    "David Kim", "Jessica Williams", "James Brown", "Amanda Taylor",
    "Robert Lee", "Lisa Anderson", "Christopher Davis", "Michelle Wilson"
]

def generate_skills():
    num_skills = random.randint(3, 5)
    selected_skills = random.sample(SKILLS_POOL, num_skills)
    skills = {skill: random.randint(5, 10) for skill in selected_skills}
    return skills

def generate_certifications():
    num_certs = random.randint(0, 2)
    if num_certs == 0:
        return []
    return random.sample(CERTIFICATIONS_POOL, num_certs)

def generate_availability():
    availability = {}
    work_days = random.randint(3, 6)
    
    if random.random() > 0.3:
        max_days = min(work_days, 5)
        days = random.sample(WEEKDAYS[:5], max_days)
    else:
        days = random.sample(WEEKDAYS, min(work_days, 7))
    
    for day in days:
        shift_type = random.choice([
            [9, 17],
            [10, 18],
            [8, 16],
            [12, 20],
            [6, 14],
        ])
        start, end = shift_type
        availability[day] = {"start": start, "end": end}
    
    return availability

def generate_performance_history(skills):
    performance = {}
    for skill in skills.keys():
        performance[skill] = round(random.uniform(0.6, 0.95), 2)
    return performance

def generate_employee(employee_id):
    name = random.choice(NAMES)
    hourly_rate = round(random.uniform(14, 25), 2)
    skills = generate_skills()
    certifications = generate_certifications()
    weekly_max_hours = random.randint(20, 40)
    availability = generate_availability()
    performance_history = generate_performance_history(skills)
    
    return {
        "employee_id": employee_id,
        "name": name,
        "hourly_rate": hourly_rate,
        "skills": json.dumps(skills),
        "certifications": json.dumps(certifications),
        "weekly_max_hours": weekly_max_hours,
        "availability": json.dumps(availability),
        "performance_history": json.dumps(performance_history)
    }

def main():
    employees = []
    for i in range(1, 11):
        employees.append(generate_employee(i))
    
    output_file = "data/employees_new.csv"
    fieldnames = [
        "employee_id", "name", "hourly_rate", "skills", 
        "certifications", "weekly_max_hours", "availability", "performance_history"
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(employees)
    
    print(f"Generated {len(employees)} employees and saved to {output_file}")
    print("\nSample employee:")
    print(json.dumps(employees[0], indent=2))

if __name__ == "__main__":
    main()

