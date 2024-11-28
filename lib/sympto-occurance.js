import * as joda from '@js-joda/core'
import { Path } from '@react-native-community/art'

const LocalDate = joda.LocalDate
const DAYS = joda.ChronoUnit.DAYS
const maxCycleLengthLastYear = 35 // TODO needs to be extracted from real data

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
      return (
        LocalDate.parse(cycleStartsAsc[i]).until(LocalDate.parse(pdate), DAYS) +
        1
      ) // cycle starts at day 1
    })
    return painCycleDays
  }

  function buildHistogram(data) {
    // Count occurrences
    const counts = data.reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    const countsFullRange = {}
    for (let i = 1; i <= maxCycleLengthLastYear; i++) {
      countsFullRange[i] = counts[i] || 0
    }

    // Convert to array of [value, count] pairs and sort
    const sortedCounts = Object.entries(countsFullRange).sort(
      (a, b) => a[0] - b[0]
    )

    return sortedCounts
  }

  function histogramPath(data, width, height) {
    const barWidth = width / data.length
    const maxValue = data.reduce(function (max, arr) {
      return max > arr[1] ? max : arr[1]
    }, -Infinity)

    const path = Path()
    const offSetForLabels = 0 // TODO figure out if this is needed
    data.forEach(([, value], index) => {
      const barHeight = (value / maxValue) * (height - offSetForLabels)
      const x = index * barWidth
      const y = height - offSetForLabels - barHeight

      path.moveTo(x, height - offSetForLabels)
      path.lineTo(x, y)
      path.lineTo(x + barWidth, y)
      path.lineTo(x + barWidth, height - offSetForLabels)
      path.close()
    })
    return path
  }

  return {
    getCycleStartsOfLastYear,
    getPainDaysOfLastYear,
    getCycleDayForPainDays,
    buildHistogram,
    histogramPath,
  }
}
