import * as joda from '@js-joda/core'
const LocalDate = joda.LocalDate
const DAYS = joda.ChronoUnit.DAYS

export default function config(opts) {
  let cycleStartsSortedByDate
  let painSortedByDate

  if (!opts) {
    // we only want to require (and run) the db module
    // when not running the tests
    cycleStartsSortedByDate = require('../db').getCycleStartsSortedByDate()
    painSortedByDate = require('../db').getPainDaysSortedByDate()
    // maxCycleLength = 45
  } else {
    cycleStartsSortedByDate = opts.cycleStartsSortedByDate || []
    painSortedByDate = opts.painSortedByDate || []
    // maxCycleLength = opts.maxCycleLength || 99
  }

  function getCycleStartsOfLastYear() {
    const today = LocalDate.parse(new Date().toISOString().slice(0, 10))
    const firstRelevantDay = today.minusYears(1)
    const relevantCycles = cycleStartsSortedByDate.filter(({ date }) =>
      LocalDate.parse(date).isAfter(firstRelevantDay)
    )
    return relevantCycles.map(({ date }) => date)
  }

  function getPainDaysOfLastYear() {
    const today = LocalDate.parse(new Date().toISOString().slice(0, 10))
    const firstRelevantDay = today.minusYears(1)
    const relevantPainDays = painSortedByDate.filter(
      ({ date, pain }) =>
        LocalDate.parse(date).isAfter(firstRelevantDay) && pain.headache
    )
    return relevantPainDays.map(({ date }) => date)
  }

  function getCycleDayForPainDays(cycleStarts, painDays) {
    let i = 0
    const cycleStartsAsc = cycleStarts.sort().reverse()
    const painDaysAsc = painDays.sort().reverse()
    const painCycleDays = painDaysAsc.map((pdate) => {
      if (LocalDate.parse(pdate).isBefore(LocalDate.parse(cycleStartsAsc[i]))) {
        // increase index i until cycleStart of this painDay is found
        for (let j = i + 1; j < cycleStartsAsc.length; j++) {
          i = j
          if (
            !LocalDate.parse(cycleStartsAsc[i]).isAfter(LocalDate.parse(pdate))
          ) {
            // not(C > P) === C ≤ P
            break
          }
        }
      }
      return LocalDate.parse(cycleStartsAsc[i]).until(
        LocalDate.parse(pdate),
        DAYS
      )
    })
    return painCycleDays
  }

  return {
    getCycleStartsOfLastYear,
    getPainDaysOfLastYear,
    getCycleDayForPainDays,
  }
}
