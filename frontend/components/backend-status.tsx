'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { healthCheck } from '@/lib/api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await healthCheck()
        setStatus('online')
        setError(null)
      } catch (err: any) {
        setStatus('offline')
        setError(err.message || 'Backend is not reachable')
      }
    }

    checkBackend()
    // Check every 5 seconds
    const interval = setInterval(checkBackend, 5000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'checking') {
    return (
      <Alert className="border-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking backend connection...</AlertTitle>
      </Alert>
    )
  }

  if (status === 'offline') {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Backend Not Connected</AlertTitle>
        <AlertDescription>
          <p className="mb-2">The backend server is not running or not reachable.</p>
          <p className="text-sm font-mono bg-background/50 p-2 rounded mt-2">
            To start the backend, run:<br />
            <code>uvicorn backend.main:app --reload --port 8000</code>
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-green-500/50 bg-green-500/5">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-700">Backend Connected</AlertTitle>
      <AlertDescription className="text-green-600/80">
        Ready to upload files and create tasks
      </AlertDescription>
    </Alert>
  )
}

