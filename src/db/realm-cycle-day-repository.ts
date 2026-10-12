import { Realm } from 'realm'

import { CycleDayRecord, CycleDayRepository } from '../lib/cycle-day-repository'

const CYCLE_DAY = 'CycleDay'
const INCLUDED_BLEEDING = 'bleeding != null AND bleeding.exclude == false'
const NEWEST_FIRST = true
const OLDEST_FIRST = false

// Dates are 'YYYY-MM-DD' strings; Realm compares strings lexicographically
// (realm-core >= 13.27), which matches chronological order.
export function createRealmCycleDayRepository(
  realm: Realm
): CycleDayRepository {
  const cycleDays = () => realm.objects<CycleDayRecord>(CYCLE_DAY)
  const cycleStarts = () => cycleDays().filtered('isCycleStart == true')

  return {
    getCycleStarts: () =>
      Array.from(cycleStarts().sorted('date', NEWEST_FIRST)),
    getLastCycleStartOnOrBefore: (date) =>
      cycleStarts()
        .filtered('date <= $0', date)
        .sorted('date', NEWEST_FIRST)[0],
    getLastCycleStartBefore: (date) =>
      cycleStarts().filtered('date < $0', date).sorted('date', NEWEST_FIRST)[0],
    getFirstCycleStartAfter: (date) =>
      cycleStarts().filtered('date > $0', date).sorted('date', OLDEST_FIRST)[0],
    getCycleStartsBefore: (date) =>
      Array.from(
        cycleStarts().filtered('date < $0', date).sorted('date', NEWEST_FIRST)
      ),
    getCycleDaysFrom: (fromDate, beforeDate) => {
      const days =
        beforeDate === undefined
          ? cycleDays().filtered('date >= $0', fromDate)
          : cycleDays().filtered(
              'date >= $0 AND date < $1',
              fromDate,
              beforeDate
            )
      return Array.from(days.sorted('date', NEWEST_FIRST))
    },
    hasIncludedBleedingDayBetween: (fromDate, beforeDate) =>
      !cycleDays()
        .filtered(
          `${INCLUDED_BLEEDING} AND date >= $0 AND date < $1`,
          fromDate,
          beforeDate
        )
        .isEmpty(),
    getIncludedBleedingDaysAfter: (date) =>
      cycleDays()
        .filtered(`${INCLUDED_BLEEDING} AND date > $0`, date)
        .sorted('date', OLDEST_FIRST),
  }
}
