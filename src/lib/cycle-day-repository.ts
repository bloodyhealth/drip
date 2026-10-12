export interface CycleDayRecord {
  date: string
  isCycleStart?: boolean
  bleeding?: { value: number; exclude?: boolean } | null
}

/**
 * Read access to cycle days for the cycle logic. Dates are 'YYYY-MM-DD'
 * strings. Lists are sorted newest first unless stated otherwise. Returned
 * records must be the stored objects, so callers can update them.
 */
export interface CycleDayRepository {
  getCycleStarts(): CycleDayRecord[]
  getLastCycleStartOnOrBefore(date: string): CycleDayRecord | undefined
  getLastCycleStartBefore(date: string): CycleDayRecord | undefined
  getFirstCycleStartAfter(date: string): CycleDayRecord | undefined
  getCycleStartsBefore(date: string): CycleDayRecord[]
  /** Days from `fromDate` (inclusive) up to `beforeDate` (exclusive, open if omitted). */
  getCycleDaysFrom(fromDate: string, beforeDate?: string): CycleDayRecord[]
  /** Whether a non-excluded bleeding day lies in [fromDate, beforeDate). */
  hasIncludedBleedingDayBetween(fromDate: string, beforeDate: string): boolean
  /** Non-excluded bleeding days after `date`, oldest first. */
  getIncludedBleedingDaysAfter(date: string): ArrayLike<CycleDayRecord>
}
