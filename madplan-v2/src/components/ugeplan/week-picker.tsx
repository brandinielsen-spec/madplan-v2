'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { getCurrentWeek, navigateWeek } from '@/lib/week-utils'

interface WeekOption {
  aar: number
  uge: number
  label: string
}

interface WeekPickerProps {
  selectedWeek: { aar: number; uge: number }
  onWeekChange: (week: { aar: number; uge: number }) => void
}

export function WeekPicker({ selectedWeek, onWeekChange }: WeekPickerProps) {
  // Generate 4 weeks: current + 3 future
  const weeks = useMemo((): WeekOption[] => {
    const current = getCurrentWeek()
    const week1 = navigateWeek(current.aar, current.uge, 'next')
    const week2 = navigateWeek(week1.aar, week1.uge, 'next')
    const week3 = navigateWeek(week2.aar, week2.uge, 'next')

    return [
      { ...current, label: 'Denne uge' },
      { ...week1, label: 'Naeste uge' },
      { ...week2, label: `Uge ${week2.uge}` },
      { ...week3, label: `Uge ${week3.uge}` },
    ]
  }, [])

  const isSelected = (week: WeekOption) =>
    week.aar === selectedWeek.aar && week.uge === selectedWeek.uge

  return (
    <div className="flex gap-2 overflow-x-auto">
      {weeks.map((week) => (
        <button
          key={`${week.aar}-${week.uge}`}
          type="button"
          onClick={() => onWeekChange({ aar: week.aar, uge: week.uge })}
          className={cn(
            'flex-shrink-0 min-h-[44px] px-3 py-2 rounded-md text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            isSelected(week)
              ? 'ring-2 ring-terracotta-500 bg-terracotta-50 text-terracotta-700'
              : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {week.label}
        </button>
      ))}
    </div>
  )
}
