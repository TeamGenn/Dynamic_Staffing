'use client'

import { useState } from 'react'
import FileUploadInput from '@/components/file-upload-input'
import UploadButton from '@/components/upload-button'

export default function IntakePage() {
  const [employeeFile, setEmployeeFile] = useState<File | null>(null)
  const [taskFile, setTaskFile] = useState<File | null>(null)
  const [employeeError, setEmployeeError] = useState<string>('')
  const [taskError, setTaskError] = useState<string>('')

  const isFormValid = employeeFile !== null && taskFile !== null && !employeeError && !taskError

  const handleEmployeeFileChange = (file: File | null, error: string) => {
    setEmployeeFile(file)
    setEmployeeError(error)
  }

  const handleTaskFileChange = (file: File | null, error: string) => {
    setTaskFile(file)
    setTaskError(error)
  }

  const handleContinue = () => {
    if (isFormValid) {
      console.log('Files ready for upload:', { employeeFile, taskFile })
      // Handle form submission here
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-sm p-8">
          {/* Header */}
          <h1 className="text-2xl font-semibold text-card-foreground mb-8 text-center">
            Upload Employee & Task Files
          </h1>

          {/* File Upload Inputs */}
          <div className="space-y-6">
            <FileUploadInput
              label="Upload Employee CSV"
              onChange={handleEmployeeFileChange}
              fileName={employeeFile?.name || ''}
              error={employeeError}
            />

            <FileUploadInput
              label="Upload Task CSV"
              onChange={handleTaskFileChange}
              fileName={taskFile?.name || ''}
              error={taskError}
            />
          </div>

          {/* Continue Button */}
          <div className="mt-8">
            <UploadButton
              onClick={handleContinue}
              disabled={!isFormValid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
