import csv
import json

def transform_availability(availability_str):
    """Transform availability from {day: [start, end]} to {day: {"start": start, "end": end}}"""
    availability_dict = json.loads(availability_str)
    transformed = {}
    for day, time_range in availability_dict.items():
        start, end = time_range
        transformed[day] = {"start": start, "end": end}
    return json.dumps(transformed)

def main():
    input_file = "data/employees.csv"
    output_file = "data/employees.csv"
    
    rows = []
    with open(input_file, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        fieldnames = reader.fieldnames
        
        for row in reader:
            # Transform only the availability column
            row['availability'] = transform_availability(row['availability'])
            rows.append(row)
    
    # Write back to file
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

if __name__ == "__main__":
    main()
