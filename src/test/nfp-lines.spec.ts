import { LocalDate } from '@js-joda/core'
import getFertilityStatus from 'sympto'

import {
  FIRST_HIGH_CYCLE_DAY,
  LOW_TEMPERATURE,
  makeCycle,
  makeDateRange,
  makeFixtureDb,
} from './fixtures/cycle-days'
import { simulateDbWrite } from './fixtures/db-mock'
import { countSymptoCallsFromApp } from './fixtures/sympto-calls'

const mockFixtureDb = makeFixtureDb([
  makeCycle('2024-01-01', 28),
  makeCycle('2024-01-29', 28),
  makeCycle('2024-02-26', 28),
  makeCycle('2024-03-25', 17),
])

jest.mock('sympto', () =>
  jest.fn(jest.requireActual<typeof import('sympto')['default']>('sympto'))
)
jest.mock('../local-storage', () =>
  require('./fixtures/local-storage-mock').makeLocalStorageMock()
)
jest.mock('../db', () => ({
  ...require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb),
}))

import { nfpLines, normalizeToScale } from '../components/helpers/chart'

const COLUMN_HEIGHT = 400
const NO_LINES = { drawLtlAt: null, drawFhmLine: false }
const ALL_DATES = makeDateRange('2023-12-20', '2024-04-10')

interface NfpLineResult {
  drawLtlAt: number | null
  drawFhmLine: boolean
}

type GetNfpLines = (
  date: string,
  temperature: number | null,
  columnHeight: number
) => NfpLineResult

function temperatureOn(date: string): number | null {
  const day = mockFixtureDb.cycleDaysSortedByDate.find((d) => d.date === date)
  return day?.temperature?.value ?? null
}

function linesFor(getLines: GetNfpLines, date: string): NfpLineResult {
  return getLines(date, temperatureOn(date), COLUMN_HEIGHT)
}

function linesForEachDate(getLines: GetNfpLines, dates: string[]) {
  return Object.fromEntries(dates.map((d) => [d, linesFor(getLines, d)]))
}

function linesForEachDateWithFreshInstance(dates: string[]) {
  return Object.fromEntries(dates.map((d) => [d, linesFor(nfpLines(), d)]))
}

function firstHighDayOf(cycleStart: string): string {
  return LocalDate.parse(cycleStart)
    .plusDays(FIRST_HIGH_CYCLE_DAY - 1)
    .toString()
}

describe('nfpLines', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date('2024-04-10T12:00:00Z') })
    simulateDbWrite()
    jest.mocked(getFertilityStatus).mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('draws no lines before the first cycle start', () => {
    // Act
    const result = linesFor(nfpLines(), '2023-12-31')

    // Assert
    expect(result).toEqual(NO_LINES)
  })

  test('draws the first-high-measurement line only on the first high day of each cycle', () => {
    // Arrange
    const cycleStarts = ['2024-01-01', '2024-01-29', '2024-02-26', '2024-03-25']
    const expectedFhmDates = cycleStarts.map(firstHighDayOf)

    // Act
    const results = linesForEachDateWithFreshInstance(ALL_DATES)

    // Assert
    const fhmDates = ALL_DATES.filter((d) => results[d].drawFhmLine)
    expect(fhmDates).toEqual(expectedFhmDates)
  })

  test('draws the cover line at the low temperature level from the fertile phase on', () => {
    // Arrange
    const expectedY = normalizeToScale(LOW_TEMPERATURE, COLUMN_HEIGHT)

    // Act
    const results = linesForEachDateWithFreshInstance(ALL_DATES)

    // Assert
    const ltlValues = new Set(
      ALL_DATES.map((d) => results[d].drawLtlAt).filter((y) => y !== null)
    )
    expect([...ltlValues]).toEqual([expectedY])
  })

  test('draws no cover line during the infertile pre-ovulatory phase', () => {
    // Act
    const results = linesForEachDateWithFreshInstance(
      makeDateRange('2024-01-29', '2024-02-02')
    )

    // Assert
    Object.values(results).forEach((r) => expect(r).toEqual(NO_LINES))
  })

  test('draws the cover line on every day of the first cycle, which has no pre-ovulatory phase', () => {
    // Act
    const results = linesForEachDateWithFreshInstance(
      makeDateRange('2024-01-01', '2024-01-28')
    )

    // Assert
    Object.values(results).forEach((r) => expect(r.drawLtlAt).not.toBeNull())
  })

  test('a shared instance returns the same lines as a fresh instance per date, in any order', () => {
    // Arrange
    const expected = linesForEachDateWithFreshInstance(ALL_DATES)
    const ascending = [...ALL_DATES]
    const descending = [...ALL_DATES].reverse()

    // Act
    const ascendingResults = linesForEachDate(nfpLines(), ascending)
    const descendingResults = linesForEachDate(nfpLines(), descending)

    // Assert
    expect(ascendingResults).toEqual(expected)
    expect(descendingResults).toEqual(expected)
  })

  test('a shared instance computes the fertility status at most once per cycle', () => {
    // Arrange
    const getLines = nfpLines()
    const numberOfCycles = mockFixtureDb.cycleStartsSortedByDate.length

    // Act
    linesForEachDate(getLines, ALL_DATES)
    linesForEachDate(getLines, [...ALL_DATES].reverse())

    // Assert
    expect(countSymptoCallsFromApp()).toBe(numberOfCycles)
  })
})
