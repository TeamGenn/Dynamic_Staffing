import csv
import json
import random

# Skills pool based on employees.csv
skills_pool = [
    'problem_solving', 'teamwork', 'multitasking', 'communication', 
    'technical_support', 'time_management', 'cash_handling', 
    'phone_etiquette', 'data_entry', 'sales', 'customer_service', 
    'documentation', 'quality_control', 'inventory_management', 
    'email_communication', 'product_knowledge'
]

task_types = [
    'customer_support', 'technical_issue', 'sales_call', 'data_entry',
    'quality_check', 'inventory_update', 'phone_support', 'documentation',
    'cash_transaction', 'product_inquiry'
]

employee_ids = list(range(1, 11))
outcomes = ['success', 'delayed', 'escalated']

with open('data/historical_tasks.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['task_id', 'task_type', 'duration_minutes', 'required_skills', 'employee_assigned', 'outcome'])
    
    for i in range(1, 301):
        task_type = random.choice(task_types)
        duration = random.randint(15, 120)
        
        # Generate realistic required skills (1-3 skills)
        num_skills = random.randint(1, 3)
        required_skills = {random.choice(skills_pool): random.randint(1, 10) for _ in range(num_skills)}
        required_skills_json = json.dumps(required_skills)
        
        employee_assigned = random.choice(employee_ids)
        outcome = random.choice(outcomes)
        
        writer.writerow([i, task_type, duration, required_skills_json, employee_assigned, outcome])

