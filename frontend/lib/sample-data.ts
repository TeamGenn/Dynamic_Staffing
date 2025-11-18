/**
 * Sample data for demo mode
 */

export const sampleEmployeesCSV = `name,skills,availability,experience_years
Alice Chen,"React, TypeScript, Node.js, API Design",Monday-Friday 9am-5pm,5
Bob Smith,"UI/UX, Design, Figma, Prototyping",Monday-Friday 9am-5pm,3
Carol White,"Testing, QA, Automation, Python",Monday-Friday 9am-5pm,4
David Jones,"DevOps, Database, AWS, Docker",Monday-Friday 9am-5pm,6
Emma Davis,"Project Management, Documentation, Communication",Monday-Friday 9am-5pm,7
Frank Miller,"Python, Data Analysis, Machine Learning",Monday-Friday 9am-5pm,4`

export const sampleTasksCSV = `task_type,duration_minutes,required_skills,priority,start_datetime,end_datetime
product_inquiry,30,"communication: 7, customer_service: 5",3,2024-01-15T09:00:00,2024-01-15T17:00:00
technical_support,60,"technical_knowledge: 8, problem_solving: 7",4,2024-01-15T09:00:00,2024-01-15T17:00:00
documentation,120,"documentation: 9, writing: 7",2,2024-01-15T09:00:00,2024-01-20T17:00:00
code_review,90,"code_review: 8, technical_knowledge: 9",3,2024-01-15T09:00:00,2024-01-18T17:00:00`

/**
 * Convert CSV string to File object
 */
export function csvToFile(csvContent: string, filename: string): File {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const file = new File([blob], filename, { 
    type: 'text/csv',
    lastModified: Date.now()
  })
  return file
}

/**
 * Get sample employee CSV file
 */
export function getSampleEmployeesFile(): File {
  return csvToFile(sampleEmployeesCSV, 'sample_employees.csv')
}

/**
 * Get sample tasks CSV file
 */
export function getSampleTasksFile(): File {
  return csvToFile(sampleTasksCSV, 'sample_tasks.csv')
}

/**
 * Sample task for quick creation
 */
export const sampleTask = {
  name: 'Build User Dashboard',
  type: 'Development',
  description: 'Create a responsive dashboard for users to view their analytics and manage their account settings.',
  duration: '8',
  priority: 'High',
  startDate: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endTime: '17:00',
  skills: {
    'React': 8,
    'TypeScript': 7,
    'UI/UX': 6
  }
}

