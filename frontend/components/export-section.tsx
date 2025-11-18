'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

interface ExportSectionProps {
  onExportPDF?: () => void
  onExportCSV?: () => void
}

export function ExportSection({ onExportPDF, onExportCSV }: ExportSectionProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | null>(null)

  const handleExport = async (format: 'pdf' | 'csv') => {
    setIsExporting(true)
    setExportFormat(format)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (format === 'pdf' && onExportPDF) {
        onExportPDF()
      } else if (format === 'csv' && onExportCSV) {
        onExportCSV()
      }
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">Export Your Schedule</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Download your finalized schedule in your preferred format for sharing and printing.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-2.5"
          >
            {isExporting && exportFormat === 'pdf' ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                Exporting...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Export as PDF
              </>
            )}
          </Button>

          <Button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            variant="outline"
            className="gap-2 rounded-lg border border-border py-2.5"
          >
            {isExporting && exportFormat === 'csv' ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export as CSV
              </>
            )}
          </Button>
        </div>

        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground space-y-1.5">
          <p>
            <span className="font-medium text-foreground">PDF includes:</span> Full schedule grid, AI recommendations summary, resource allocation chart
          </p>
          <p>
            <span className="font-medium text-foreground">CSV includes:</span> All task details, employee assignments, time allocations (can import to Excel/Sheets)
          </p>
        </div>
      </div>
    </div>
  )
}
