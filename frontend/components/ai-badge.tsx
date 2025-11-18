'use client'

import { Sparkles, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AIBadgeProps {
  feature?: string
  explanation?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AIBadge({ 
  feature = 'AI-Powered', 
  explanation,
  size = 'md'
}: AIBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const badge = (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium ${sizeClasses[size]}`}>
      <Sparkles className={iconSizes[size]} />
      {feature}
    </span>
  )

  if (explanation) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{explanation}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}

