'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface CSVPreviewProps {
  file: File
  title: string
}

export function CSVPreview({ file, title }: CSVPreviewProps) {
  const [rows, setRows] = useState<string[][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const parsedRows = lines.slice(0, 6).map(line =>
        line.split(',').map(cell => cell.trim())
      )
      setRows(parsedRows)
      setLoading(false)
    }
    reader.readAsText(file)
  }, [file])

  if (loading) {
    return <Card className="p-6"><p className="text-muted-foreground">Loading preview...</p></Card>
  }

  if (rows.length === 0) {
    return <Card className="p-6"><p className="text-destructive">Error reading CSV</p></Card>
  }

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-foreground">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {rows[0].map((header, i) => (
                <th key={i} className="border-b border-border px-3 py-2 text-left font-medium text-foreground">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1, 6).map((row, i) => (
              <tr key={i} className="border-b border-border">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-foreground text-xs sm:text-sm">
                    {cell.length > 50 ? cell.substring(0, 50) + '...' : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Showing first 5 rows of data
      </p>
    </div>
  )
}
