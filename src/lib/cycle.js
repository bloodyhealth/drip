import * as joda from '@js-joda/core'
import { getCycleLengthStats } from './cycle-length'

const LocalDate = joda.LocalDate
const DAYS = joda.ChronoUnit.DAYS

const DEFAULT_OPTIONS = {
  maxBreakInBleeding: 1,
  maxCycleLength: 99,
  minCyclesForPrediction: 3,
}

export function createCycleModule(repository, options = {}) {
  const { maxBreakInBleeding, maxCycleLength, minCyclesForPrediction } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  function getLastMensesStartForDay(targetDateString) {
    return repository.getLastCycleStartOnOrBefore(targetDateString)
  }

  function getCycleDayNumber(targetDateString) {
    const lastMensesStart = getLastMensesStartForDay(targetDateString)
    if (!lastMensesStart) return null
    const targetDate = LocalDate.parse(targetDateString)
    const lastMensesLocalDate = LocalDate.parse(lastMensesStart.date)
    const diffInDays = lastMensesLocalDate.until(targetDate, DAYS)
    // take maxCycleLength into account (we don't display cycle day numbers higher than 99 at the moment)
    if (diffInDays >= maxCycleLength) return null
    // cycle starts at day 1
    return diffInDays + 1
  }

  function getPreviousCycle(dateString) {
    const cycleStart = getLastMensesStartForDay(dateString)
    if (!cycleStart) return null
    const earlierCycleStart = repository.getLastCycleStartBefore(
      cycleStart.date
    )
    if (!earlierCycleStart) return null
    return getCycleByStartDay(earlierCycleStart)
  }

  function getCyclesBefore(targetCycleStartDay) {
    const earlierCycleStarts = repository.getCycleStartsBefore(
      targetCycleStartDay.date
    )
    if (!earlierCycleStarts.length) return null
    return (
      earlierCycleStarts
        .map((start) => getCycleByStartDay(start))
        // filter the ones exceeding maxCycleLength, those are null
        .filter((cycle) => cycle)
    )
  }

  function getTodayDate() {
    return new Date().toISOString().slice(0, 10)
  }

  function getCycleLength(startDate, endDate) {
    return LocalDate.parse(startDate).until(LocalDate.parse(endDate), DAYS)
  }

  function isValidCycle(startDate, endDate) {
    return getCycleLength(startDate, endDate) <= maxCycleLength
  }

  function getCycleByStartDay(startDay, todayDate) {
    let cycleEndDate = todayDate || getTodayDate()

    const nextCycleStart = repository.getFirstCycleStartAfter(startDay.date)
    if (nextCycleStart) cycleEndDate = nextCycleStart.date

    if (isValidCycle(startDay.date, cycleEndDate)) {
      return repository.getCycleDaysFrom(startDay.date, nextCycleStart?.date)
    }

    return null
  }

  function getCycleForDay(dayOrDate, todayDate) {
    const dateString =
      typeof dayOrDate === 'string' ? dayOrDate : dayOrDate.date
    const cycleStart = getLastMensesStartForDay(dateString)
    if (!cycleStart) return null
    return getCycleByStartDay(cycleStart, todayDate)
  }

  function isMensesStart(cycleDay) {
    if (!cycleDay.bleeding || cycleDay.bleeding.exclude) return false
    if (noBleedingDayWithinThresholdBefore(cycleDay)) return true
    return false

    // checks that there are no relevant bleeding days before
    // the input cycleDay (returns boolean)
    function noBleedingDayWithinThresholdBefore(cycleDay) {
      const localDate = LocalDate.parse(cycleDay.date)
      const threshold = localDate.minusDays(maxBreakInBleeding + 1).toString()
      return !repository.hasIncludedBleedingDayBetween(threshold, cycleDay.date)
    }
  }

  // returns all bleeding days that belong to one menses directly following
  // the cycle day. used to set or clear new cycle starts when the target day
  // changes
  function getMensesDaysRightAfter(cycleDay) {
    const bleedingDays = repository.getIncludedBleedingDaysAfter(cycleDay.date)
    return recurse(cycleDay, 0, [])

    // we look at the current bleeding day as well as the next, and decide
    // whether they belong to one menses. if they do, we collect them, once
    // they don't, we're done
    function recurse(day, nextIndex, mensesDays) {
      const next = bleedingDays[nextIndex]
      if (!next) return mensesDays
      if (!isWithinThreshold(day, next)) return mensesDays
      mensesDays.unshift(next)
      return recurse(next, nextIndex + 1, mensesDays)
    }

    // checks whether the two days belong to one menses episode
    function isWithinThreshold(bleedingDay, nextBleedingDay) {
      const localDate = LocalDate.parse(bleedingDay.date)
      const threshold = localDate.plusDays(maxBreakInBleeding + 1).toString()
      return nextBleedingDay.date <= threshold
    }
  }

  function getAllCycleLengths() {
    const cycleStartsSortedByDate = repository.getCycleStarts()
    return cycleStartsSortedByDate
      .map((day) => LocalDate.parse(day.date))
      .map((cycleStart, i, startsAsLocalDates) => {
        if (i === cycleStartsSortedByDate.length - 1) return null
        const prevCycleStart = startsAsLocalDates[i + 1]
        return prevCycleStart.until(cycleStart, DAYS)
      })
      .filter((length) => length && length <= maxCycleLength)
  }

  function getPredictedMenses() {
    const cycleLengths = getAllCycleLengths()
    if (cycleLengths.length < minCyclesForPrediction) {
      return []
    }
    const cycleInfo = getCycleLengthStats(cycleLengths)
    const periodDistance = Math.round(cycleInfo.mean)
    let periodStartVariation
    if (cycleInfo.stdDeviation === null) {
      periodStartVariation = 2
    } else if (cycleInfo.stdDeviation < 1.5) {
      // threshold is chosen a little arbitrarily
      periodStartVariation = 1
    } else {
      periodStartVariation = 2
    }
    if (periodDistance - 5 < periodStartVariation) {
      // otherwise predictions overlap
      return []
    }
    const allMensesStarts = repository.getCycleStarts()
    let lastStart = LocalDate.parse(allMensesStarts[0].date)
    const predictedMenses = []
    for (let i = 0; i < 3; i++) {
      lastStart = lastStart.plusDays(periodDistance)
      const nextPredictedDates = [lastStart.toString()]
      for (let j = 0; j < periodStartVariation; j++) {
        nextPredictedDates.push(lastStart.minusDays(j + 1).toString())
        nextPredictedDates.push(lastStart.plusDays(j + 1).toString())
      }
      nextPredictedDates.sort()
      predictedMenses.push(nextPredictedDates)
    }
    return predictedMenses
  }

  const getStats = () => {
    const cycleStartsSortedByDate = repository.getCycleStarts()
    return cycleStartsSortedByDate.map((day, i) => {
      let cycleLength
      if (i === 0) {
        // in the most recent cycle, its length equals the number of the current day within the cycle
        cycleLength = getCycleDayNumber(getTodayDate())
      } else {
        // for all other cylces, subtract the previous start date from the current start date
        const parsedDay = LocalDate.parse(day.date)
        const parsedPreviousCycleStartDay = LocalDate.parse(
          cycleStartsSortedByDate[i - 1].date
        )
        cycleLength = parsedDay.until(parsedPreviousCycleStartDay, DAYS)
      }

      return {
        date: day.date,
        cycleLength,
        bleedingLength: ++getMensesDaysRightAfter(day).length,
      }
    })
  }

  return {
    getLastMensesStartForDay,
    getCycleDayNumber,
    getCycleForDay,
    getPreviousCycle,
    getCyclesBefore,
    getAllCycleLengths,
    getPredictedMenses,
    isMensesStart,
    getMensesDaysRightAfter,
    getCycleByStartDay,
    getStats,
  }
}
