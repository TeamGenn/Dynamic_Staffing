'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Task {
  id: number
  name: string
  type: string
  priority: string
  duration: string
  skills: string[]
  description?: string
}

interface QueuedTasksListProps {
  tasks: Task[]
  onRemoveTask: (taskId: number) => void
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
      {tasks.map((task) => (
        <div key={task.id} className="rounded-lg border border-border bg-card p-4">
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
                  {task.skills.slice(0, 2).map(s => (
                    <span key={s} className="rounded border border-border bg-muted px-1.5 py-0.5 text-muted-foreground">{s}</span>
                  ))}
                  {task.skills.length > 2 && <span className="text-muted-foreground">+{task.skills.length - 2}</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => onRemoveTask(task.id)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
              title="Remove task"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
