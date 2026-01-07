import { 
  format, 
  differenceInDays, 
  eachDayOfInterval, 
  isWithinInterval,
  parseISO,
  addDays
} from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: vi })
}

export function calculateRentalDays(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return differenceInDays(end, start) + 1 // Include both start and end days
}

export function generateDateRange(startDate: Date | string, endDate: Date | string): Date[] {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return eachDayOfInterval({ start, end })
}

export function checkDateOverlap(
  range1Start: Date,
  range1End: Date,
  range2Start: Date,
  range2End: Date
): boolean {
  return (
    isWithinInterval(range1Start, { start: range2Start, end: range2End }) ||
    isWithinInterval(range1End, { start: range2Start, end: range2End }) ||
    isWithinInterval(range2Start, { start: range1Start, end: range1End }) ||
    isWithinInterval(range2End, { start: range1Start, end: range1End })
  )
}

export function calculatePrice(dailyPrice: number, days: number): number {
  return dailyPrice * days
}
