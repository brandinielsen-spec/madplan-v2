import {
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  addWeeks,
  subWeeks,
  format,
} from 'date-fns'
import { da } from 'date-fns/locale'

export function getCurrentWeek(): { aar: number; uge: number } {
  const now = new Date()
  return {
    aar: getISOWeekYear(now), // IMPORTANT: Use getISOWeekYear, not getYear
    uge: getISOWeek(now),
  }
}

export function navigateWeek(
  aar: number,
  uge: number,
  direction: 'prev' | 'next'
): { aar: number; uge: number } {
  const date = getDateFromISOWeek(aar, uge)
  const newDate = direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1)

  return {
    aar: getISOWeekYear(newDate),
    uge: getISOWeek(newDate),
  }
}

export function getDateFromISOWeek(year: number, week: number): Date {
  // January 4th is always in week 1 per ISO 8601
  const jan4 = new Date(year, 0, 4)
  const startOfWeek1 = startOfISOWeek(jan4)
  return addWeeks(startOfWeek1, week - 1)
}

export function getWeekDates(aar: number, uge: number): Date[] {
  const weekStart = getDateFromISOWeek(aar, uge)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date
  })
}

export function formatDayDate(date: Date): string {
  return format(date, 'd. MMM', { locale: da })
}

export function formatWeekLabel(aar: number, uge: number): string {
  return `Uge ${uge}, ${aar}`
}

/**
 * Get an array of weeks centered around a given week
 * @param centerWeek - The week to center the range around
 * @param range - Number of weeks on each side (e.g., 4 = 9 weeks total)
 * @returns Array of {aar, uge} for weeks from -range to +range
 */
export function getWeeksInRange(
  centerWeek: { aar: number; uge: number },
  range: number
): Array<{ aar: number; uge: number }> {
  const weeks: Array<{ aar: number; uge: number }> = []

  // Start from -range weeks
  let current = { ...centerWeek }
  for (let i = 0; i < range; i++) {
    current = navigateWeek(current.aar, current.uge, 'prev')
  }

  // Now add (range * 2 + 1) weeks
  for (let i = 0; i < range * 2 + 1; i++) {
    weeks.push({ aar: current.aar, uge: current.uge })
    if (i < range * 2) {
      current = navigateWeek(current.aar, current.uge, 'next')
    }
  }

  return weeks
}

/**
 * Get the number of weeks between two week references
 * @returns Positive if 'to' is after 'from', negative otherwise
 */
export function getWeekOffset(
  from: { aar: number; uge: number },
  to: { aar: number; uge: number }
): number {
  const fromDate = getDateFromISOWeek(from.aar, from.uge)
  const toDate = getDateFromISOWeek(to.aar, to.uge)
  const diffMs = toDate.getTime() - fromDate.getTime()
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000))
  return diffWeeks
}

/**
 * Check if two week references are the same week
 */
export function isSameWeek(
  a: { aar: number; uge: number },
  b: { aar: number; uge: number }
): boolean {
  return a.aar === b.aar && a.uge === b.uge
}
