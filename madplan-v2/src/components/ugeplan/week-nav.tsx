'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatWeekLabel } from '@/lib/week-utils'

interface WeekNavProps {
  aar: number
  uge: number
  onPrev: () => void
  onNext: () => void
  isLoading?: boolean
}

export function WeekNav({ aar, uge, onPrev, onNext, isLoading }: WeekNavProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        disabled={isLoading}
        aria-label="Forrige uge"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <h2 className="text-lg font-heading font-semibold">
        {formatWeekLabel(aar, uge)}
      </h2>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={isLoading}
        aria-label="Naeste uge"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
