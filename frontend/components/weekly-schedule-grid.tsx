'use client'

import { Card } from '@/components/ui/card'

export interface ScheduleBlock {
  id: string
  employeeId: string
  employeeName: string
  taskName: string
  day: number // 0-6 for Mon-Sun
  startTime: number // 0-24 (can be decimal like 9.5 for 9:30)
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
  const WORK_HOURS = Array.from({ length: 10 }, (_, i) => i + 8) // 8 AM to 5 PM (8-17)

  const colorMap: Record<string, string> = {
    'Development': 'bg-blue-500/30 border-l-4 border-blue-600 text-blue-900 dark:text-blue-100 shadow-sm',
    'Design': 'bg-purple-500/30 border-l-4 border-purple-600 text-purple-900 dark:text-purple-100 shadow-sm',
    'QA': 'bg-green-500/30 border-l-4 border-green-600 text-green-900 dark:text-green-100 shadow-sm',
    'Documentation': 'bg-amber-500/30 border-l-4 border-amber-600 text-amber-900 dark:text-amber-100 shadow-sm',
    'Research': 'bg-pink-500/30 border-l-4 border-pink-600 text-pink-900 dark:text-pink-100 shadow-sm',
    'Support': 'bg-cyan-500/30 border-l-4 border-cyan-600 text-cyan-900 dark:text-cyan-100 shadow-sm',
    'Testing': 'bg-emerald-500/30 border-l-4 border-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-sm',
    'DevOps': 'bg-indigo-500/30 border-l-4 border-indigo-600 text-indigo-900 dark:text-indigo-100 shadow-sm',
    'Database': 'bg-orange-500/30 border-l-4 border-orange-600 text-orange-900 dark:text-orange-100 shadow-sm',
    'API Design': 'bg-teal-500/30 border-l-4 border-teal-600 text-teal-900 dark:text-teal-100 shadow-sm',
    'Project Management': 'bg-rose-500/30 border-l-4 border-rose-600 text-rose-900 dark:text-rose-100 shadow-sm',
  }

  // Get all blocks for a specific employee and day
  const getBlocksForEmployeeDay = (employeeId: string, day: number): ScheduleBlock[] => {
    return scheduleBlocks.filter(block =>
      block.employeeId === employeeId &&
      block.day === day
    ).sort((a, b) => a.startTime - b.startTime)
  }

  // Calculate position and height for a block
  const getBlockStyle = (block: ScheduleBlock, hourHeight: number = 40) => {
    const startHour = Math.floor(block.startTime)
    const startMinute = (block.startTime - startHour) * 60
    
    // Position from top of the day column
    const topOffset = ((block.startTime - 8) * hourHeight) // 8 is the start hour
    const height = block.duration * hourHeight
    
    return {
      top: `${Math.max(0, topOffset)}px`,
      height: `${Math.max(20, height)}px`,
      left: '0',
      right: '0',
    }
  }

  // Check if block should be visible in the 8-18 hour range
  const isBlockVisible = (block: ScheduleBlock): boolean => {
    const endTime = block.startTime + block.duration
    return block.startTime < 18 && endTime > 8
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div className="inline-block min-w-full">
        {/* Header - Days of Week */}
        <div className="flex">
          <div className="w-32 flex-shrink-0 border-r border-border bg-gradient-to-br from-primary/10 to-primary/5 p-3 font-semibold text-foreground">
            Employee
          </div>
          {DAYS.map((day, idx) => {
            const dayColors = [
              'from-blue-500/10 to-blue-400/5',
              'from-purple-500/10 to-purple-400/5',
              'from-green-500/10 to-green-400/5',
              'from-amber-500/10 to-amber-400/5',
              'from-pink-500/10 to-pink-400/5',
              'from-cyan-500/10 to-cyan-400/5',
              'from-indigo-500/10 to-indigo-400/5',
            ]
            return (
              <div 
                key={idx} 
                className={`flex-1 border-r border-border bg-gradient-to-br ${dayColors[idx]} p-3 text-center font-semibold text-sm min-w-32`}
              >
                {day}
              </div>
            )
          })}
        </div>

        {/* Employee Rows */}
        {employees.map((employee) => (
          <div key={employee.id} className="flex border-b border-border">
            {/* Employee Name Column */}
            <div className="w-32 flex-shrink-0 border-r border-border bg-gradient-to-r from-card to-card/80 p-3 font-medium text-sm">
              <div className="truncate font-semibold text-foreground">{employee.name}</div>
            </div>

            {/* Day Columns */}
            {DAYS.map((_, dayIdx) => {
              const blocks = getBlocksForEmployeeDay(employee.id, dayIdx).filter(isBlockVisible)
              
              return (
                <div
                  key={dayIdx}
                  className="flex-1 border-r border-border bg-gradient-to-br from-card/80 to-card/40 min-w-32 relative"
                >
                  {/* Day Column Container - 10 hours (8 AM to 6 PM) */}
                  <div className="relative" style={{ height: '400px', minHeight: '400px' }}>
                    {/* Hour markers with subtle gradient */}
                    <div className="absolute inset-0 flex flex-col">
                      {WORK_HOURS.map((hour, idx) => (
                        <div
                          key={hour}
                          className={`flex-1 border-b text-[9px] px-1 ${
                            idx % 2 === 0 
                              ? 'border-border/10 bg-background/30 text-muted-foreground' 
                              : 'border-border/20 bg-background/50 text-muted-foreground'
                          }`}
                          style={{ minHeight: '40px' }}
                        >
                          <span className="opacity-60 font-medium">{hour}:00</span>
                        </div>
                      ))}
                    </div>

                    {/* Render blocks for this employee and day */}
                    {blocks.map((block) => {
                      const style = getBlockStyle(block, 40)
                      const displayColor = colorMap[block.type] || block.color || 'bg-muted/20'
                      
                      return (
                        <div
                          key={block.id}
                          className={`absolute rounded-md p-2 text-[10px] font-medium shadow-md hover:shadow-lg transition-shadow z-10 border ${displayColor}`}
                          style={style}
                          title={`${block.taskName} - ${block.type} (${block.duration}h)`}
                        >
                          <div className="truncate font-bold leading-tight">{block.taskName}</div>
                          <div className="truncate text-[9px] font-semibold opacity-90 mt-0.5">
                            {block.type} • {block.duration}h
                          </div>
                          {block.startTime % 1 !== 0 && (
                            <div className="text-[8px] opacity-70 mt-0.5 font-medium">
                              {Math.floor(block.startTime)}:{String(Math.round((block.startTime % 1) * 60)).padStart(2, '0')}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-border bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 p-4">
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(colorMap).map(([type, color]) => {
            // Extract color name from className (e.g., "bg-blue-500/30" -> "blue-500")
            const bgMatch = color.match(/bg-(\w+-\d+)/)
            const colorName = bgMatch ? bgMatch[1] : 'gray-500'
            const [colorBase, shade] = colorName.split('-')
            
            // Create a simple color indicator using Tailwind classes
            const legendColors: Record<string, string> = {
              'blue': 'bg-blue-500 border-blue-600',
              'purple': 'bg-purple-500 border-purple-600',
              'green': 'bg-green-500 border-green-600',
              'emerald': 'bg-emerald-500 border-emerald-600',
              'amber': 'bg-amber-500 border-amber-600',
              'pink': 'bg-pink-500 border-pink-600',
              'cyan': 'bg-cyan-500 border-cyan-600',
              'indigo': 'bg-indigo-500 border-indigo-600',
              'orange': 'bg-orange-500 border-orange-600',
              'teal': 'bg-teal-500 border-teal-600',
              'rose': 'bg-rose-500 border-rose-600',
              'violet': 'bg-violet-500 border-violet-600',
            }
            
            const legendColor = legendColors[colorBase] || 'bg-gray-500 border-gray-600'
            
            return (
              <div key={type} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/70 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className={`h-4 w-4 rounded border-2 ${legendColor}`}></div>
                <span className="font-semibold text-foreground">{type}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
