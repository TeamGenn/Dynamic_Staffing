'use client'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
      </div>
      <p className="text-sm text-muted-foreground">Processing your schedule with AI...</p>
    </div>
  )
}
