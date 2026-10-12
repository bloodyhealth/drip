import {
  CycleDayRecord,
  CycleDayRepository,
} from '../../lib/cycle-day-repository'

export interface InMemoryCycleDays {
  cycleDaysSortedByDate?: CycleDayRecord[]
  bleedingDaysSortedByDate?: CycleDayRecord[]
  cycleStartsSortedByDate?: CycleDayRecord[]
}

// Reads the given (newest-first) lists on every call, so tests can change
// them in place like live Realm results.
export function createInMemoryCycleDayRepository(
  data: InMemoryCycleDays
): CycleDayRepository {
  const starts = () => data.cycleStartsSortedByDate ?? []
  const days = () => data.cycleDaysSortedByDate ?? []
  const includedBleedingDays = () =>
    (data.bleedingDaysSortedByDate ?? []).filter((d) => !d.bleeding?.exclude)

  return {
    getCycleStarts: () => [...starts()],
    getLastCycleStartOnOrBefore: (date) => starts().find((s) => s.date <= date),
    getLastCycleStartBefore: (date) => starts().find((s) => s.date < date),
    getFirstCycleStartAfter: (date) =>
      [...starts()].reverse().find((s) => s.date > date),
    getCycleStartsBefore: (date) => starts().filter((s) => s.date < date),
    getCycleDaysFrom: (fromDate, beforeDate) =>
      days().filter(
        (d) =>
          d.date >= fromDate &&
          (beforeDate === undefined || d.date < beforeDate)
      ),
    hasIncludedBleedingDayBetween: (fromDate, beforeDate) =>
      includedBleedingDays().some(
        (d) => d.date >= fromDate && d.date < beforeDate
      ),
    getIncludedBleedingDaysAfter: (date) =>
      includedBleedingDays()
        .filter((d) => d.date > date)
        .reverse(),
  }
}
