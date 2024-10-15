import * as joda from '@js-joda/core'
const LocalDate = joda.LocalDate
// const DAYS = joda.ChronoUnit.DAYS

export default function config(opts) {
  let cycleStartsSortedByDate

  if (!opts) {
    // we only want to require (and run) the db module
    // when not running the tests
    cycleStartsSortedByDate = require('../db').getCycleStartsSortedByDate()
    // maxCycleLength = 45
  } else {
    cycleStartsSortedByDate = opts.cycleStartsSortedByDate || []
    // maxCycleLength = opts.maxCycleLength || 99
  }

  function getCycleStartsOfLastYear() {
    const today = LocalDate.parse(new Date().toISOString().slice(0, 10))
    const firstRelevantCycleStart = today.minusYears(1)
    const relevantCycles = cycleStartsSortedByDate.filter(({ date }) =>
      LocalDate.parse(date).isAfter(firstRelevantCycleStart)
    )
    return relevantCycles.map(({ date }) => date)
  }

  function getTodayDate() {
    return new Date().toISOString().slice(0, 10)
  }

  const getStats = () =>
    cycleStartsSortedByDate.map((day, i) => {
      const today = getTodayDate()
      return {
        date: today,
        k: i,
      }
    })

  return {
    getCycleStartsOfLastYear,
    getStats,
  }
}
