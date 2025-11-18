'use client'

import { useState, useEffect } from 'react'
import { CSVPreview } from '@/components/csv-preview'
import { EnhancedFileUpload } from '@/components/enhanced-file-upload'
import { TaskCreationForm } from '@/components/task-creation-form'
import { QueuedTasksList } from '@/components/queued-tasks-list'
import { ProgressStepper } from '@/components/progress-stepper'
import { AIBadge } from '@/components/ai-badge'
import { BackendStatus } from '@/components/backend-status'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { initSession, uploadFile, getSchedule } from '@/lib/api'
import { getSampleEmployeesFile, getSampleTasksFile } from '@/lib/sample-data'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function IntakePage() {
  const router = useRouter()
  
  const [employeeCsv, setEmployeeCsv] = useState<File | null>(null)
  const [tasksCsv, setTasksCsv] = useState<File | null>(null)
  const [queuedTasks, setQueuedTasks] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState<'upload' | 'create' | 'queue'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        await initSession()
      } catch (error: any) {
        console.error('Failed to initialize session:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeSession()
  }, [])

  const handleAddTask = (task: any) => {
    setQueuedTasks([...queuedTasks, { ...task, id: task.task_id || Date.now() }])
    setActiveSection('queue')
    toast.success('Task added to queue!')
  }

  const handleRemoveTask = (taskId: number | string) => {
    setQueuedTasks(queuedTasks.filter(t => (t.id || t.task_id) !== taskId))
    toast.info('Task removed from queue')
  }

  const handleFileSelect = (file: File, type: 'employee' | 'task') => {
    if (type === 'employee') {
      setEmployeeCsv(file)
    } else {
      setTasksCsv(file)
    }
    setUploadError(null)
  }

  const handleLoadSampleData = () => {
    setEmployeeCsv(getSampleEmployeesFile())
    setTasksCsv(getSampleTasksFile())
    toast.success('Sample data loaded!')
  }

  const handleUploadFiles = async () => {
    if (!employeeCsv || !tasksCsv) {
      setUploadError('Please select both employee and task CSV files')
      toast.error('Please select both files')
      return
    }

    setIsUploading(true)
    setUploadError(null)
    toast.loading('Uploading files...', { id: 'upload' })

    try {
      await uploadFile(employeeCsv, 'employees_profiles')
      toast.success('Employee file uploaded!', { id: 'upload-employee' })
      
      await uploadFile(tasksCsv, 'historical_tasks')
      toast.success('Task file uploaded!', { id: 'upload-tasks' })

      toast.success('All files uploaded successfully!', { id: 'upload' })
      setActiveSection('create')
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to upload files. Please try again.'
      setUploadError(errorMsg)
      toast.error(errorMsg, { 
        id: 'upload',
        duration: 10000 // Show longer for connection errors
      })
      
      // If it's a connection error, show helpful message
      if (errorMsg.includes('Cannot connect to backend')) {
        toast.error(
          'Backend server is not running. Please start it first!',
          { 
            id: 'backend-error',
            duration: 15000
          }
        )
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleStartScheduling = async () => {
    if (queuedTasks.length === 0) {
      setUploadError('Please add at least one task before scheduling')
      toast.error('Please add at least one task')
      return
    }

    toast.loading('Generating schedule...', { id: 'schedule' })

    try {
      const scheduleData = await getSchedule()
      sessionStorage.setItem('scheduleData', JSON.stringify(scheduleData))
      toast.success('Schedule generated!', { id: 'schedule' })
      router.push('/review')
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to get schedule. Please try again.'
      setUploadError(errorMsg)
      toast.error(errorMsg, { id: 'schedule' })
    }
  }

  const steps = [
    { id: 'upload', label: 'Upload Files', description: 'Employee & task data' },
    { id: 'create', label: 'Create Tasks', description: 'Define requirements' },
    { id: 'queue', label: 'Review Queue', description: 'Ready to schedule' }
  ]

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Initializing...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <ProgressStepper 
            steps={steps} 
            currentStep={activeSection}
            onStepClick={(stepId) => {
              if (stepId === 'upload' || (stepId === 'create' && (employeeCsv && tasksCsv)) || (stepId === 'queue' && queuedTasks.length > 0)) {
                setActiveSection(stepId as any)
              }
            }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        {/* Upload Section */}
        {activeSection === 'upload' && (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Upload Employee & Task Files
                </h1>
                <p className="text-muted-foreground">
                  Upload CSV files containing employee profiles and historical task data
                </p>
              </div>
              <AIBadge 
                feature="AI-Powered"
                explanation="Our AI will analyze and embed this data for intelligent matching"
              />
            </div>

            {/* Backend Status Check */}
            <div className="mb-6">
              <BackendStatus />
            </div>

            {uploadError && (
              <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                {uploadError}
              </div>
            )}

            <div className="space-y-8">
              {/* Sample Data Button */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-1">Want to try it out?</p>
                    <p className="text-sm text-muted-foreground">Load sample data to see how it works</p>
                  </div>
                  <Button onClick={handleLoadSampleData} variant="outline" size="sm">
                    Load Sample Data
                  </Button>
                </div>
              </div>

              {/* Employee CSV Upload */}
              <EnhancedFileUpload
                label="Upload Employee CSV"
                accept=".csv"
                file={employeeCsv}
                onFileSelect={(file) => handleFileSelect(file, 'employee')}
                onFileRemove={() => setEmployeeCsv(null)}
                disabled={isUploading}
                description="Drag and drop employee CSV file or click to browse"
              />

              {/* Task CSV Upload */}
              <EnhancedFileUpload
                label="Upload Task CSV"
                accept=".csv"
                file={tasksCsv}
                onFileSelect={(file) => handleFileSelect(file, 'task')}
                onFileRemove={() => setTasksCsv(null)}
                disabled={isUploading}
                description="Drag and drop task CSV file or click to browse"
              />

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

              {/* Upload and Continue Button */}
              <Button
                onClick={handleUploadFiles}
                disabled={!employeeCsv || !tasksCsv || isUploading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-medium rounded-lg"
              >
                {isUploading ? 'Uploading...' : 'Upload Files & Continue'}
              </Button>
            </div>
          </div>
        )}

        {/* Create Tasks Section */}
        {activeSection === 'create' && (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Create Tasks</h1>
                <p className="text-muted-foreground">Define new tasks with skill requirements and priorities</p>
              </div>
              <div className="flex items-center gap-2">
                <AIBadge 
                  feature="AI Matching"
                  explanation="AI will analyze task complexity and match employees using semantic search"
                />
                <button
                  onClick={() => setActiveSection('upload')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              </div>
            </div>
            <TaskCreationForm onAddTask={handleAddTask} />
          </div>
        )}

        {/* Queue Section */}
        {activeSection === 'queue' && (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">Queued Tasks</h1>
                <AIBadge 
                  feature="Smart Scheduling"
                  explanation="AI will optimize task scheduling based on priority, deadlines, and employee availability"
                />
              </div>
              <p className="text-muted-foreground">
                {queuedTasks.length} task{queuedTasks.length !== 1 ? 's' : ''} ready for scheduling
              </p>
            </div>

            {uploadError && (
              <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                {uploadError}
              </div>
            )}

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

