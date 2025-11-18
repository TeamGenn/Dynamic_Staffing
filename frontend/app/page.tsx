'use client'

import { useState } from 'react'
import { CSVPreview } from '@/components/csv-preview'
import { TaskCreationForm } from '@/components/task-creation-form'
import { QueuedTasksList } from '@/components/queued-tasks-list'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function IntakePage() {
  const router = useRouter()
  const [employeeCsv, setEmployeeCsv] = useState<File | null>(null)
  const [tasksCsv, setTasksCsv] = useState<File | null>(null)
  const [queuedTasks, setQueuedTasks] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState<'upload' | 'create' | 'queue'>('upload')

  const handleAddTask = (task: any) => {
    setQueuedTasks([...queuedTasks, { ...task, id: Date.now() }])
    setActiveSection('queue')
  }

  const handleRemoveTask = (taskId: number) => {
    setQueuedTasks(queuedTasks.filter(t => t.id !== taskId))
  }

  const handleStartScheduling = async () => {
    const scheduleData = {
      employees: employeeCsv ? await parseCSV(employeeCsv) : [],
      tasks: tasksCsv ? await parseCSV(tasksCsv) : [],
      queuedTasks
    }
    sessionStorage.setItem('scheduleData', JSON.stringify(scheduleData))
    router.push('/review')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Upload Section - Only visible when activeSection is 'upload' */}
        {activeSection === 'upload' && (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <h1 className="text-center text-3xl font-bold text-foreground mb-8">Upload Employee & Task Files</h1>

            <div className="space-y-8">
              {/* Employee CSV Upload */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Upload Employee CSV</h2>
                <label className="block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setEmployeeCsv(file)
                    }}
                    className="hidden"
                  />
                  <div className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted bg-background/50 px-6 py-8 text-center hover:border-border transition-colors">
                    <span className="text-muted-foreground">Choose a CSV file or drag and drop</span>
                  </div>
                </label>
                {employeeCsv && (
                  <p className="mt-3 text-sm text-foreground">
                    <span className="text-success">✓</span> {employeeCsv.name}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">Only CSV files are allowed.</p>
              </div>

              {/* Task CSV Upload */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Upload Task CSV</h2>
                <label className="block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setTasksCsv(file)
                    }}
                    className="hidden"
                  />
                  <div className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted bg-background/50 px-6 py-8 text-center hover:border-border transition-colors">
                    <span className="text-muted-foreground">Choose a CSV file or drag and drop</span>
                  </div>
                </label>
                {tasksCsv && (
                  <p className="mt-3 text-sm text-foreground">
                    <span className="text-success">✓</span> {tasksCsv.name}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">Only CSV files are allowed.</p>
              </div>

              {/* CSV Previews */}
              {employeeCsv && (
                <div className="mt-6 pt-6 border-t border-border">
                  <CSVPreview file={employeeCsv} title="Employee Data Preview" />
                </div>
              )}
              {tasksCsv && (
                <div className="mt-6 pt-6 border-t border-border">
                  <CSVPreview file={tasksCsv} title="Tasks Data Preview" />
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={() => setActiveSection('create')}
                disabled={!employeeCsv || !tasksCsv}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-medium rounded-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Create Tasks Section */}
        {activeSection === 'create' && (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Create Tasks</h1>
              <button
                onClick={() => setActiveSection('upload')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
            </div>
            <TaskCreationForm onAddTask={handleAddTask} />
          </div>
        )}

        {/* Queue Section */}
        {activeSection === 'queue' && (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Queued Tasks</h1>
              <p className="mt-2 text-muted-foreground">
                {queuedTasks.length} task{queuedTasks.length !== 1 ? 's' : ''} ready for scheduling
              </p>
            </div>

            <QueuedTasksList tasks={queuedTasks} onRemoveTask={handleRemoveTask} />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => setActiveSection('create')}
                variant="outline"
                className="flex-1 py-3 text-base font-medium"
              >
                Add More Tasks
              </Button>
              <Button
                onClick={handleStartScheduling}
                disabled={queuedTasks.length === 0}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-medium"
              >
                Start Scheduling
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const obj: any = {}
        headers.forEach((header, i) => {
          obj[header] = values[i]
        })
        return obj
      })
      resolve(data)
    }
    reader.readAsText(file)
  })
}
