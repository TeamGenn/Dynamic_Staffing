'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Task {
  id?: number | string
  task_id?: string
  name: string
  type: string
  priority: string
  duration: string
  skills: string[] | Record<string, number> // Can be array or object with skill levels
  description?: string
}

interface QueuedTasksListProps {
  tasks: Task[]
  onRemoveTask: (taskId: number | string) => void
}

export function QueuedTasksList({ tasks, onRemoveTask }: QueuedTasksListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-background/50 p-8 text-center">
        <p className="text-muted-foreground">No tasks queued yet. Create a task to get started.</p>
      </div>
    )
  }

  const priorityBg = {
    Low: 'bg-blue-50 text-blue-700 border border-blue-200',
    Medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    High: 'bg-orange-50 text-orange-700 border border-orange-200',
    Critical: 'bg-red-50 text-red-700 border border-red-200'
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        // Get task ID (can be id or task_id)
        const taskId = task.id || task.task_id || ''
        
        // Convert skills to array format for display
        // Skills can be either an array of strings or an object with skill names as keys
        const skillsArray = Array.isArray(task.skills) 
          ? task.skills 
          : typeof task.skills === 'object' && task.skills !== null
          ? Object.keys(task.skills)
          : []
        
        return (
          <div key={taskId} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">{task.name}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityBg[task.priority as keyof typeof priorityBg]}`}>
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground">{task.type}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{task.duration}h</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <div className="flex gap-1 text-xs">
                    {skillsArray.slice(0, 2).map(skill => (
                      <span key={skill} className="rounded border border-border bg-muted px-1.5 py-0.5 text-muted-foreground">
                        {skill}
                        {!Array.isArray(task.skills) && typeof task.skills === 'object' && task.skills !== null && (
                          <span className="ml-1 text-[10px] opacity-70">({task.skills[skill]})</span>
                        )}
                      </span>
                    ))}
                    {skillsArray.length > 2 && <span className="text-muted-foreground">+{skillsArray.length - 2}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemoveTask(taskId)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                title="Remove task"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
