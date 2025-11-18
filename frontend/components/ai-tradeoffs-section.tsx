'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, ThumbsUp } from 'lucide-react'

export interface AITradeoff {
  id: string
  title: string
  description: string
  impact: string
  recommendation: string
  approved?: boolean
}

interface AITradeoffsSectionProps {
  tradeoffs: AITradeoff[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function AITradeoffsSection({ tradeoffs, onApprove, onReject }: AITradeoffsSectionProps) {
  const [decisions, setDecisions] = useState<Record<string, boolean>>({})

  const handleApprove = (id: string) => {
    setDecisions(prev => ({ ...prev, [id]: true }))
    onApprove(id)
  }

  const handleReject = (id: string) => {
    setDecisions(prev => ({ ...prev, [id]: false }))
    onReject(id)
  }

  if (tradeoffs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-background/50 p-8 text-center">
        <p className="text-muted-foreground">No optimization recommendations available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tradeoffs.map((tradeoff) => {
        const isDecided = tradeoff.id in decisions
        const isApproved = decisions[tradeoff.id]

        return (
          <div key={tradeoff.id} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-foreground">{tradeoff.title}</h4>
                  {isDecided && (
                    isApproved ? (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )
                  )}
                </div>
                <p className="mt-2 text-sm text-foreground">{tradeoff.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Impact</p>
                <p className="mt-1.5 text-sm text-foreground">{tradeoff.impact}</p>
              </div>

              <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                <p className="text-xs font-semibold text-accent uppercase tracking-wide">Recommendation</p>
                <p className="mt-1.5 text-sm text-foreground">{tradeoff.recommendation}</p>
              </div>
            </div>

            {!isDecided ? (
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => handleApprove(tradeoff.id)}
                  size="sm"
                  className="flex-1 gap-2 bg-success text-success-foreground hover:bg-success/90 rounded-lg"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(tradeoff.id)}
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 rounded-lg border border-border"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                <ThumbsUp className="h-4 w-4" />
                {isApproved ? 'Approved' : 'Rejected'}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
