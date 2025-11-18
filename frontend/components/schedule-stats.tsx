'use client'

import { Clock, Users, BarChart3, Zap } from 'lucide-react'

interface ScheduleStatsProps {
  totalHours: number
  employeeCount: number
  taskCount: number
  utilizationRate: number
}

export function ScheduleStats({ totalHours, employeeCount, taskCount, utilizationRate }: ScheduleStatsProps) {
  const stats = [
    {
      icon: Clock,
      label: 'Total Hours',
      value: totalHours.toString(),
      color: 'text-primary'
    },
    {
      icon: Users,
      label: 'Team Members',
      value: employeeCount.toString(),
      color: 'text-accent'
    },
    {
      icon: BarChart3,
      label: 'Tasks Scheduled',
      value: taskCount.toString(),
      color: 'text-success'
    },
    {
      icon: Zap,
      label: 'Utilization',
      value: `${utilizationRate}%`,
      color: 'text-warning'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
