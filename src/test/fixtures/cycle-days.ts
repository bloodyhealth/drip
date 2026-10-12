import { LocalDate } from '@js-joda/core'

export interface FixtureCycleDay {
  date: string
  isCycleStart: boolean
  bleeding?: { value: number; exclude: boolean }
  temperature?: { value: number; exclude: boolean }
  mucus?: {
    value: number | null
    feeling: number | null
    texture: number | null
    exclude: boolean
  }
  cervix?: {
    opening: number | null
    firmness: number | null
    position: number | null
    exclude: boolean
  }
  note?: { value: string }
  pain?: { cramps?: boolean; headache?: boolean }
}

export interface FixtureDb {
  cycleDaysSortedByDate: FixtureCycleDay[]
  bleedingDaysSortedByDate: FixtureCycleDay[]
  cycleStartsSortedByDate: FixtureCycleDay[]
}

export const LOW_TEMPERATURE = 36.4
export const HIGH_TEMPERATURE = 36.9
export const FIRST_HIGH_CYCLE_DAY = 14

function mucusFor(
  cycleDayNumber: number,
  firstHighCycleDay: number
): FixtureCycleDay['mucus'] {
  const isPeak =
    cycleDayNumber >= firstHighCycleDay - 4 &&
    cycleDayNumber <= firstHighCycleDay - 2
  const value = isPeak ? 4 : 0
  return {
    value,
    feeling: isPeak ? 3 : 0,
    texture: isPeak ? 2 : 0,
    exclude: false,
  }
}

export function makeCycleDay(
  date: string,
  cycleDayNumber: number,
  firstHighCycleDay = FIRST_HIGH_CYCLE_DAY
): FixtureCycleDay {
  const isHigh = cycleDayNumber >= firstHighCycleDay
  const day: FixtureCycleDay = {
    date,
    isCycleStart: cycleDayNumber === 1,
    temperature: {
      value: isHigh ? HIGH_TEMPERATURE : LOW_TEMPERATURE,
      exclude: false,
    },
    mucus: mucusFor(cycleDayNumber, firstHighCycleDay),
  }
  if (cycleDayNumber <= 5) day.bleeding = { value: 2, exclude: false }
  return day
}

export function makeCycle(
  startDate: string,
  length: number,
  firstHighCycleDay = FIRST_HIGH_CYCLE_DAY
): FixtureCycleDay[] {
  const start = LocalDate.parse(startDate)
  return Array.from({ length }, (_, i) =>
    makeCycleDay(start.plusDays(i).toString(), i + 1, firstHighCycleDay)
  )
}

export function makeFixtureDb(cycles: FixtureCycleDay[][]): FixtureDb {
  const cycleDaysSortedByDate = cycles
    .flat()
    .sort((a, b) => b.date.localeCompare(a.date))
  return {
    cycleDaysSortedByDate,
    bleedingDaysSortedByDate: cycleDaysSortedByDate.filter((d) => d.bleeding),
    cycleStartsSortedByDate: cycleDaysSortedByDate.filter(
      (d) => d.isCycleStart
    ),
  }
}

export function makeDateRange(fromDate: string, toDate: string): string[] {
  const dates: string[] = []
  let current = LocalDate.parse(fromDate)
  const end = LocalDate.parse(toDate)
  while (!current.isAfter(end)) {
    dates.push(current.toString())
    current = current.plusDays(1)
  }
  return dates
}
