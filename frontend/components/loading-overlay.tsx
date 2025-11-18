'use client'

import { LoadingSpinner } from '@/components/loading-spinner'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export function LoadingOverlay({ isLoading, message = 'Processing...' }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-sm font-medium text-foreground">{message}</p>
      </div>
    </div>
  )
}
