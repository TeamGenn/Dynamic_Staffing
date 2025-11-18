/**
 * API utility functions for communicating with the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiError {
  detail: string
}

export interface UploadResponse {
  message: string
  filename: string
  data_type: string
  size_in_bytes: number
}

export interface TaskCreateRequest {
  task_type: string
  duration_minutes: number
  required_skills: Record<string, number>
  priority: number
  start_datetime: string
  end_datetime: string
}

export interface TaskCreateResponse {
  task_id: string
  status: string
}

export interface ScheduleResponse {
  schedule?: any[]
  message?: string
}

export interface EmployeeSearchRequest {
  task_id: string
  task_type: string
  duration_minutes: number
  required_skills: Record<string, number>
  priority: number
  start_datetime: string
  end_datetime: string
}

export interface EmployeeSearchResponse {
  task_id: string
  complexity_analysis: any
  top_employees: any[]
  recommendation_summary: string
}

/**
 * Initialize a session with the backend
 */
export async function initSession(): Promise<{ session_token: string }> {
  try {
    const response = await fetch(`${API_URL}/init-session`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to initialize session: ${response.statusText}`)
    }

    return response.json()
  } catch (error: any) {
    // Silently fail for session init - might already have a session
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.warn('Backend not reachable, continuing without session initialization')
      return { session_token: 'local-session' }
    }
    throw error
  }
}

/**
 * Upload a CSV file to the backend
 */
export async function uploadFile(
  file: File,
  dataType: 'employees_profiles' | 'historical_tasks'
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('data_type', dataType)

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      // Don't set Content-Type header - browser will set it with boundary for FormData
    })

    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.statusText}`
      try {
        const error: ApiError = await response.json()
        errorMessage = error.detail || errorMessage
      } catch {
        // If response isn't JSON, use status text
        errorMessage = `Upload failed with status ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error: any) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      // Check if backend is actually reachable
      try {
        const healthResponse = await fetch(`${API_URL}/health`, { method: 'GET' })
        if (!healthResponse.ok) {
          throw new Error(
            `Backend at ${API_URL} is not responding correctly. ` +
            `Health check returned status ${healthResponse.status}. ` +
            `Please check if the backend server is running: uvicorn backend.main:app --reload --port 8000`
          )
        }
        // Backend is reachable but upload failed - might be CORS or endpoint issue
        throw new Error(
          `Cannot upload to backend at ${API_URL}/upload. ` +
          `Backend is running but upload endpoint may have an issue. ` +
          `Check browser console for CORS errors.`
        )
      } catch (healthError: any) {
        // Health check also failed
        throw new Error(
          `Cannot connect to backend at ${API_URL}. ` +
          `Please make sure the backend server is running: ` +
          `uvicorn backend.main:app --reload --port 8000`
        )
      }
    }
    throw error
  }
}

/**
 * Create a new task
 */
export async function createTask(task: TaskCreateRequest): Promise<TaskCreateResponse> {
  const response = await fetch(`${API_URL}/create-task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.detail || `Failed to create task: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get the schedule for the current session
 */
export async function getSchedule(): Promise<ScheduleResponse> {
  const response = await fetch(`${API_URL}/get-schedule`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.detail || `Failed to get schedule: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Search for employees matching task requirements
 */
export async function searchEmployees(
  request: EmployeeSearchRequest
): Promise<EmployeeSearchResponse> {
  const response = await fetch(`${API_URL}/search-employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.detail || `Failed to search employees: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`)
  }

  return response.json()
}

