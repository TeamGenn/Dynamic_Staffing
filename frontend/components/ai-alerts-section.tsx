'use client'

import { AlertCircle, TrendingUp, Info } from 'lucide-react'

export interface AIAlert {
  id: string
  type: 'risk' | 'warning' | 'info'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

interface AIAlertsSectionProps {
  alerts: AIAlert[]
}

export function AIAlertsSection({ alerts }: AIAlertsSectionProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-background/50 p-8 text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <AlertCircle className="h-6 w-6 text-success" />
        </div>
        <h3 className="font-semibold text-foreground">No Issues Detected</h3>
        <p className="mt-1 text-sm text-muted-foreground">Your schedule looks optimal with no conflicts or skill gaps.</p>
      </div>
    )
  }

  const severityConfig = {
    low: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700', icon: Info },
    medium: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: TrendingUp },
    high: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle }
  }

  const typeIcons = {
    risk: AlertCircle,
    warning: TrendingUp,
    info: Info
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity]
        const Icon = typeIcons[alert.type]
        return (
          <div
            key={alert.id}
            className={`rounded-lg border-2 ${config.border} ${config.bg} p-4 ${config.text}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold">{alert.title}</h4>
                <p className="mt-1 text-sm opacity-85">{alert.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
