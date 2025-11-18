'use client'

import { useState, useEffect } from 'react'
import { AIAlertsSection, type AIAlert } from '@/components/ai-alerts-section'
import { AITradeoffsSection, type AITradeoff } from '@/components/ai-tradeoffs-section'
import { WeeklyScheduleGrid, type ScheduleBlock } from '@/components/weekly-schedule-grid'
import { ScheduleStats } from '@/components/schedule-stats'
import { ScheduleSummary } from '@/components/schedule-summary'
import { ExportSection } from '@/components/export-section'
import { LoadingOverlay } from '@/components/loading-overlay'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import { getSchedule } from '@/lib/api'
import { transformScheduleToBlocks, extractEmployeesFromBlocks } from '@/lib/schedule-transform'

// Mock data - fallback if API fails
const MOCK_ALERTS: AIAlert[] = [
  {
    id: '1',
    type: 'risk',
    title: 'Skill Gap Detected',
    description: 'Designer role requires UI/UX skills, but 1 task has no qualified designer assigned.',
    severity: 'high'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Overallocation Warning',
    description: 'John Doe is scheduled for 10 hours on Friday, exceeding the 8-hour workday limit.',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'info',
    title: 'Schedule Optimization',
    description: 'Backend development tasks can start Monday instead of Wednesday for better resource utilization.',
    severity: 'low'
  }
]

const MOCK_TRADEOFFS: AITradeoff[] = [
  {
    id: 'trade-1',
    title: 'Extended Timeline for Quality',
    description: 'Allocate extra 8 hours for QA testing to reduce bugs in production.',
    impact: 'Adds 1 day to project timeline, reduces defects by ~40%',
    recommendation: 'Approve: This improves code quality significantly with minimal schedule impact.'
  },
  {
    id: 'trade-2',
    title: 'Parallel Task Execution',
    description: 'Run UI and Backend development in parallel instead of sequentially.',
    impact: 'Reduces timeline by 3 days, increases coordination overhead by 25%',
    recommendation: 'Approve: Net savings justify the coordination effort.'
  },
  {
    id: 'trade-3',
    title: 'Junior Developer Assignment',
    description: 'Use junior developer for Frontend tasks with senior mentoring.',
    impact: 'Saves 40 hours, requires 5 hours mentoring per week',
    recommendation: 'Conditional: Approve only if senior developer availability confirmed.'
  }
]

const MOCK_EMPLOYEES = [
  { id: '1', name: 'Alice Chen' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Carol White' },
  { id: '4', name: 'David Jones' }
]

const MOCK_SCHEDULE: ScheduleBlock[] = [
  {
    id: 's1',
    employeeId: '1',
    employeeName: 'Alice Chen',
    taskName: 'API Design',
    day: 0,
    startTime: 9,
    duration: 4,
    type: 'Development',
    color: 'bg-primary/20'
  },
  {
    id: 's2',
    employeeId: '1',
    employeeName: 'Alice Chen',
    taskName: 'Code Review',
    day: 0,
    startTime: 13,
    duration: 3,
    type: 'Development',
    color: 'bg-primary/20'
  },
  {
    id: 's3',
    employeeId: '2',
    employeeName: 'Bob Smith',
    taskName: 'UI Components',
    day: 1,
    startTime: 9,
    duration: 6,
    type: 'Design',
    color: 'bg-accent/20'
  },
  {
    id: 's4',
    employeeId: '3',
    employeeName: 'Carol White',
    taskName: 'QA Testing',
    day: 2,
    startTime: 8,
    duration: 8,
    type: 'QA',
    color: 'bg-success/20'
  },
  {
    id: 's5',
    employeeId: '4',
    employeeName: 'David Jones',
    taskName: 'Documentation',
    day: 3,
    startTime: 10,
    duration: 5,
    type: 'Documentation',
    color: 'bg-secondary/20'
  },
  {
    id: 's6',
    employeeId: '2',
    employeeName: 'Bob Smith',
    taskName: 'Design Review',
    day: 4,
    startTime: 9,
    duration: 3,
    type: 'Design',
    color: 'bg-accent/20'
  }
]

export default function ReviewPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('alerts')
  const [approvedTradeoffs, setApprovedTradeoffs] = useState<string[]>([])
  const [scheduleData, setScheduleData] = useState<any>(null)
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([])
  const [employees, setEmployees] = useState<Array<{ id: string; name: string }>>(MOCK_EMPLOYEES)
  const [error, setError] = useState<string | null>(null)

  // Fetch schedule data from backend
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true)
        const data = await getSchedule()
        setScheduleData(data)
        
        // Transform backend data to schedule blocks
        if (data.schedule && Array.isArray(data.schedule) && data.schedule.length > 0) {
          const blocks = transformScheduleToBlocks(data.schedule, MOCK_EMPLOYEES)
          setScheduleBlocks(blocks)
          
          // Extract unique employees from blocks
          const extractedEmployees = extractEmployeesFromBlocks(blocks)
          if (extractedEmployees.length > 0) {
            setEmployees(extractedEmployees)
          }
        } else {
          // Use mock data if no schedule from backend
          setScheduleBlocks(MOCK_SCHEDULE)
        }
        
        // Also check session storage for any additional data
        const storedData = sessionStorage.getItem('scheduleData')
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData)
            if (parsed.schedule && Array.isArray(parsed.schedule) && parsed.schedule.length > 0) {
              const blocks = transformScheduleToBlocks(parsed.schedule, MOCK_EMPLOYEES)
              setScheduleBlocks(blocks)
              const extractedEmployees = extractEmployeesFromBlocks(blocks)
              if (extractedEmployees.length > 0) {
                setEmployees(extractedEmployees)
              }
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch schedule:', err)
        setError(err.message || 'Failed to load schedule')
        // Use mock data as fallback
        setScheduleBlocks(MOCK_SCHEDULE)
        // Try to use session storage as fallback
        const storedData = sessionStorage.getItem('scheduleData')
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData)
            if (parsed.schedule && Array.isArray(parsed.schedule)) {
              const blocks = transformScheduleToBlocks(parsed.schedule, MOCK_EMPLOYEES)
              setScheduleBlocks(blocks)
            }
          } catch (e) {
            // Ignore
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  const handleApproveTradeoff = (id: string) => {
    setApprovedTradeoffs([...approvedTradeoffs, id])
  }

  const handleRejectTradeoff = (id: string) => {
    setApprovedTradeoffs(approvedTradeoffs.filter(t => t !== id))
  }

  const handleExportPDF = () => {
    // In a real app, use a library like jsPDF or html2pdf
    alert('PDF export initiated. In production, this would generate a professional PDF.')
  }

  const handleExportCSV = () => {
    // Generate CSV content
    const csvContent = 'data:text/csv;charset=utf-8,Employee,Task,Day,Start Time,Duration\nAlice Chen,API Design,Monday,09:00,4 hours\nBob Smith,UI Components,Tuesday,09:00,6 hours'
    const link = document.createElement('a')
    link.setAttribute('href', csvContent)
    link.setAttribute('download', 'schedule.csv')
    link.click()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/'}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Intake
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Schedule Review & Approval</h1>
                <p className="text-sm text-muted-foreground">Review AI recommendations and finalize your schedule</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoadingOverlay isLoading={isLoading} message="Loading schedule..." />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {error && (
          <Card className="border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}

        {/* Schedule Summary */}
        <ScheduleSummary
          totalTasks={scheduleBlocks.length || scheduleData?.schedule?.length || 0}
          aiRecommendations={MOCK_TRADEOFFS.length}
          approvedRecommendations={approvedTradeoffs.length}
          conflictsResolved={2}
        />

        {/* Schedule Stats */}
        <ScheduleStats
          totalHours={scheduleBlocks.reduce((sum, block) => sum + block.duration, 0) || 0}
          employeeCount={employees.length}
          taskCount={scheduleBlocks.length}
          utilizationRate={scheduleBlocks.length > 0 ? Math.round((scheduleBlocks.length / employees.length) * 20) : 0}
        />

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts">
              AI Alerts
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive/20 text-xs font-medium text-destructive">
                {MOCK_ALERTS.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="tradeoffs">
              AI Recommendations
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-accent">
                {MOCK_TRADEOFFS.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          </TabsList>

          {/* AI Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">System Alerts & Issues</h2>
              <AIAlertsSection alerts={MOCK_ALERTS} />
            </Card>
          </TabsContent>

          {/* AI Tradeoffs Tab */}
          <TabsContent value="tradeoffs" className="space-y-4">
            <Card className="p-6">
              <div className="mb-4 space-y-1">
                <h2 className="text-lg font-semibold">AI-Powered Optimization Recommendations</h2>
                <p className="text-sm text-muted-foreground">
                  Review these recommendations from our AI system. Approved changes will be applied to your schedule.
                </p>
              </div>
            </Card>
            <AITradeoffsSection
              tradeoffs={MOCK_TRADEOFFS}
              onApprove={handleApproveTradeoff}
              onReject={handleRejectTradeoff}
            />
            {approvedTradeoffs.length > 0 && (
              <Card className="border-success/20 bg-success/5 p-4">
                <p className="text-sm text-success">
                  {approvedTradeoffs.length} recommendation{approvedTradeoffs.length !== 1 ? 's' : ''} approved and will be reflected in your schedule.
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Weekly Team Schedule</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Visual representation of all assigned tasks across your team for the week.
              </p>
              {scheduleBlocks.length > 0 ? (
                <WeeklyScheduleGrid scheduleBlocks={scheduleBlocks} employees={employees} />
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">No schedule data available. Create tasks to generate a schedule.</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Section */}
        <ExportSection onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />

        {/* Action Buttons */}
        <Card className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Back to Intake
            </Button>
            <Button
              onClick={() => alert('Schedule finalized! Your team can now view the approved schedule.')}
              className="flex-1 bg-success text-success-foreground hover:bg-success/90 sm:flex-none"
            >
              Finalize Schedule
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
