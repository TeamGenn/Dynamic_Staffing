/**
 * Transform backend schedule data to frontend ScheduleBlock format
 */

import type { ScheduleBlock } from '@/components/weekly-schedule-grid'

interface BackendTask {
  task_id: string
  task_type: string
  duration_minutes: number
  priority: number
  required_skills: string | Record<string, number>
  start_datetime: string | Date
  end_datetime: string | Date
}

interface Employee {
  id: string
  name: string
}

/**
 * Convert backend task data to ScheduleBlock format
 * Since backend doesn't assign employees yet, we'll create a placeholder assignment
 */
export function transformScheduleToBlocks(
  tasks: BackendTask[],
  employees: Employee[] = []
): ScheduleBlock[] {
  if (!tasks || tasks.length === 0) {
    return []
  }

  const blocks: ScheduleBlock[] = []
  
  // If no employees provided, create placeholder employees from tasks
  const employeeList = employees.length > 0 
    ? employees 
    : Array.from({ length: Math.min(tasks.length, 5) }, (_, i) => ({
        id: `emp-${i + 1}`,
        name: `Employee ${i + 1}`
      }))

  tasks.forEach((task, index) => {
    const startDate = new Date(task.start_datetime)
    const endDate = new Date(task.end_datetime)
    
    // Calculate day of week (0 = Monday, 6 = Sunday)
    // JavaScript getDay() returns 0 = Sunday, so we adjust
    const dayOfWeek = (startDate.getDay() + 6) % 7
    
    // Get start time in hours (0-24)
    const startTime = startDate.getHours() + startDate.getMinutes() / 60
    
    // Convert duration from minutes to hours
    const durationHours = task.duration_minutes / 60
    
    // Assign to employee (round-robin for now, since backend doesn't assign)
    const employeeIndex = index % employeeList.length
    const employee = employeeList[employeeIndex]
    
    // Map task_type to display type with more variety
    const typeMap: Record<string, string> = {
      'Development': 'Development',
      'Design': 'Design',
      'QA': 'QA',
      'Testing': 'Testing',
      'Documentation': 'Documentation',
      'Research': 'Research',
      'DevOps': 'DevOps',
      'Database': 'Database',
      'API Design': 'API Design',
      'Project Management': 'Project Management',
      'product_inquiry': 'Support',
      'technical_support': 'Support',
      'code_review': 'Development',
      'ui_ux': 'Design',
      'backend': 'Development',
      'frontend': 'Development',
      'mobile': 'Development',
    }
    
    const displayType = typeMap[task.task_type] || 
      (task.task_type.includes('dev') || task.task_type.includes('code') ? 'Development' :
       task.task_type.includes('design') || task.task_type.includes('ui') ? 'Design' :
       task.task_type.includes('test') || task.task_type.includes('qa') ? 'Testing' :
       task.task_type.includes('doc') ? 'Documentation' :
       task.task_type.includes('support') || task.task_type.includes('inquiry') ? 'Support' :
       'Development')
    
    // Create task name from task_type
    const taskName = task.task_type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    blocks.push({
      id: task.task_id || `task-${index}`,
      employeeId: employee.id,
      employeeName: employee.name,
      taskName: taskName,
      day: dayOfWeek,
      startTime: Math.floor(startTime),
      duration: Math.ceil(durationHours),
      type: displayType,
      color: getColorForType(displayType)
    })
  })
  
  return blocks
}

/**
 * Get color class for task type
 */
function getColorForType(type: string): string {
  const colorMap: Record<string, string> = {
    'Development': 'bg-blue-500/30 border-l-4 border-blue-600 text-blue-900 dark:text-blue-100 shadow-sm',
    'Design': 'bg-purple-500/30 border-l-4 border-purple-600 text-purple-900 dark:text-purple-100 shadow-sm',
    'QA': 'bg-green-500/30 border-l-4 border-green-600 text-green-900 dark:text-green-100 shadow-sm',
    'Testing': 'bg-emerald-500/30 border-l-4 border-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-sm',
    'Documentation': 'bg-amber-500/30 border-l-4 border-amber-600 text-amber-900 dark:text-amber-100 shadow-sm',
    'Research': 'bg-pink-500/30 border-l-4 border-pink-600 text-pink-900 dark:text-pink-100 shadow-sm',
    'Support': 'bg-cyan-500/30 border-l-4 border-cyan-600 text-cyan-900 dark:text-cyan-100 shadow-sm',
    'DevOps': 'bg-indigo-500/30 border-l-4 border-indigo-600 text-indigo-900 dark:text-indigo-100 shadow-sm',
    'Database': 'bg-orange-500/30 border-l-4 border-orange-600 text-orange-900 dark:text-orange-100 shadow-sm',
    'API Design': 'bg-teal-500/30 border-l-4 border-teal-600 text-teal-900 dark:text-teal-100 shadow-sm',
    'Project Management': 'bg-rose-500/30 border-l-4 border-rose-600 text-rose-900 dark:text-rose-100 shadow-sm',
  }
  
  return colorMap[type] || 'bg-violet-500/30 border-l-4 border-violet-600 text-violet-900 dark:text-violet-100 shadow-sm'
}

/**
 * Extract unique employees from schedule blocks
 */
export function extractEmployeesFromBlocks(blocks: ScheduleBlock[]): Employee[] {
  const employeeMap = new Map<string, Employee>()
  
  blocks.forEach(block => {
    if (!employeeMap.has(block.employeeId)) {
      employeeMap.set(block.employeeId, {
        id: block.employeeId,
        name: block.employeeName
      })
    }
  })
  
  return Array.from(employeeMap.values())
}

