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
