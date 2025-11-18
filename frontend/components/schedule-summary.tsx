'use client'

import { CheckCircle2 } from 'lucide-react'

interface ScheduleSummaryProps {
  totalTasks: number
  aiRecommendations: number
  approvedRecommendations: number
  conflictsResolved: number
}

export function ScheduleSummary({
  totalTasks,
  aiRecommendations,
  approvedRecommendations,
  conflictsResolved
}: ScheduleSummaryProps) {
  return (
    <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Schedule Summary</h3>
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tasks Scheduled</p>
            <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recommendations</p>
            <p className="text-2xl font-bold text-accent">{aiRecommendations}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Approved</p>
            <p className="text-2xl font-bold text-success">{approvedRecommendations}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Conflicts Resolved</p>
            <p className="text-2xl font-bold text-primary">{conflictsResolved}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <p>Your schedule is optimized and ready for execution.</p>
        </div>
      </div>
    </div>
  )
}
