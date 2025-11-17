'use client'

import { cn } from '@/lib/utils'

interface FlickerTextProps {
  children: React.ReactNode
  className?: string
}

export function FlickerText({ children, className }: FlickerTextProps) {
  return (
    <span className={cn('flicker', className)}>
      {children}
    </span>
  )
}

