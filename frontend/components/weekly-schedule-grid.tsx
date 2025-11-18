'use client'

import { Card } from '@/components/ui/card'

export interface ScheduleBlock {
  id: string
  employeeId: string
  employeeName: string
  taskName: string
  day: number // 0-6 for Mon-Sun
  startTime: number // 0-24
  duration: number // hours
  type: string // Development, Design, etc
  color: string // color class
}

interface WeeklyScheduleGridProps {
  scheduleBlocks: ScheduleBlock[]
  employees: Array<{ id: string; name: string }>
}

export function WeeklyScheduleGrid({ scheduleBlocks, employees }: WeeklyScheduleGridProps) {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const HOURS = Array.from({ length: 24 }, (_, i) => i)

  const getBlocksForCell = (employeeId: string, day: number, hour: number) => {
    return scheduleBlocks.filter(block =>
      block.employeeId === employeeId &&
      block.day === day &&
      block.startTime <= hour &&
      block.startTime + block.duration > hour
    )
  }

  const colorMap: Record<string, string> = {
    'Development': 'bg-primary/20 border-l-4 border-primary text-primary',
    'Design': 'bg-accent/20 border-l-4 border-accent text-accent',
    'QA': 'bg-success/20 border-l-4 border-success text-success',
    'Documentation': 'bg-secondary/20 border-l-4 border-secondary text-secondary',
    'Research': 'bg-warning/20 border-l-4 border-warning text-warning',
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div className="inline-block min-w-full">
        {/* Header - Days of Week */}
        <div className="flex">
          <div className="w-32 flex-shrink-0 border-r border-border bg-muted p-3 font-semibold">
            Employee
          </div>
          {DAYS.map((day, idx) => (
            <div key={idx} className="flex-1 border-r border-border bg-muted p-3 text-center font-semibold text-sm min-w-24">
              {day}
            </div>
          ))}
        </div>

        {/* Time Rows and Employee Columns */}
        {employees.map((employee) => (
          <div key={employee.id} className="flex border-b border-border">
            {/* Employee Name Column */}
            <div className="w-32 flex-shrink-0 border-r border-border bg-card p-3 font-medium text-sm">
              <div className="truncate">{employee.name}</div>
            </div>

            {/* Day Columns */}
            {DAYS.map((_, dayIdx) => (
              <div
                key={dayIdx}
                className="flex-1 border-r border-border bg-card/50 min-w-24"
              >
                <div className="flex h-32 flex-col text-xs">
                  {/* Hourly Grid for the Day */}
                  <div className="relative flex h-full flex-col divide-y divide-border/30">
                    {HOURS.slice(8, 18).map((hour) => (
                      <div
                        key={hour}
                        className="relative h-8 flex-1 border-b border-border/30 bg-gradient-to-b from-transparent to-transparent hover:bg-muted/30 transition-colors"
                      >
                        {/* Get the first block starting at this hour */}
                        {getBlocksForCell(employee.id, dayIdx, hour)[0] && (
                          <div className="absolute inset-0 overflow-hidden">
                            {getBlocksForCell(employee.id, dayIdx, hour)[0] && (
                              (() => {
                                const block = getBlocksForCell(employee.id, dayIdx, hour)[0]
                                if (block.startTime === hour) {
                                  const heightPercent = Math.min(block.duration * 100, 100)
                                  return (
                                    <div
                                      className={`w-full overflow-hidden rounded-sm p-1 text-[10px] font-medium ${colorMap[block.type] || 'bg-muted'}`}
                                      style={{
                                        height: `${Math.min(block.duration * 32, 200)}px`
                                      }}
                                    >
                                      <div className="truncate font-semibold">{block.taskName}</div>
                                      <div className="truncate text-[9px] opacity-75">{block.type}</div>
                                    </div>
                                  )
                                }
                              })()
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-border bg-muted p-4">
        <div className="flex flex-wrap gap-4 text-xs">
          {Object.entries(colorMap).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${color.split(' ')[0]}`}></div>
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
