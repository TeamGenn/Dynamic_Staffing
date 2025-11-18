'use client'

import { useState } from 'react'

interface FileUploadInputProps {
  label: string
  onChange: (file: File | null, error: string) => void
  fileName: string
  error: string
}

export default function FileUploadInput({
  label,
  onChange,
  fileName,
  error,
}: FileUploadInputProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    validateAndSetFile(file)
  }

  const validateAndSetFile = (file: File | undefined) => {
    if (!file) {
      onChange(null, '')
      return
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      onChange(null, 'Please upload a valid CSV file.')
      return
    }

    onChange(file, '')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        {label}
      </label>

      {/* File Input */}
      <div className="relative">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id={`file-input-${label}`}
        />
        <label
          htmlFor={`file-input-${label}`}
          className={`
            block
            px-4
            py-3
            border-2
            border-dashed
            rounded-lg
            text-center
            cursor-pointer
            transition-colors
            ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }
          `}
          onDragOver={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          <div className="text-sm text-muted-foreground">
            Choose a CSV file or drag and drop
          </div>
        </label>
      </div>

      {/* File Name Display */}
      {fileName && (
        <p className="text-sm text-muted-foreground truncate">
          ✓ {fileName}
        </p>
      )}

      {/* Info Text */}
      <p className="text-xs text-muted-foreground">
        Only CSV files are allowed.
      </p>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
