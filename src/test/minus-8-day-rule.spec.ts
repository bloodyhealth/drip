import { LocalDate } from '@js-joda/core'

import { FixtureDb, makeCycle, makeFixtureDb } from './fixtures/cycle-days'
import { simulateDbWrite } from './fixtures/db-mock'

const CYCLE_LENGTH = 28
const FIRST_START = LocalDate.parse('2023-01-20')

// Cycles start on the 20th or later, so each first high temperature
// (cycle day 14 or 15) falls into the month after the cycle start.
function makeCyclesAcrossMonths(count: number): FixtureDb {
  return makeFixtureDb(
    Array.from({ length: count }, (_, i) =>
      makeCycle(
        FIRST_START.plusDays(i * CYCLE_LENGTH).toString(),
        CYCLE_LENGTH,
        i === 0 ? 14 : 15
      )
    )
  )
}

let mockFixtureDb = makeCyclesAcrossMonths(15)

jest.mock('../local-storage', () =>
  require('./fixtures/local-storage-mock').makeLocalStorageMock()
)
jest.mock('../db', () =>
  require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb)
)

import { getCycleStatusForDay } from '../lib/sympto-adapter'

function onCycleDayOfLatestCycle(cycleCount: number, cycleDay: number) {
  return FIRST_START.plusDays((cycleCount - 1) * CYCLE_LENGTH + cycleDay - 1)
}

function preOvulatoryEndInLatestCycle(cycleCount: number) {
  mockFixtureDb = makeCyclesAcrossMonths(cycleCount)
  simulateDbWrite()
  const today = onCycleDayOfLatestCycle(cycleCount, 20)
  jest.setSystemTime(new Date(`${today}T12:00:00Z`))
  const status = getCycleStatusForDay(today.toString())
  return status?.phases.preOvulatory?.end?.date
}

describe('minus-8-day rule across month boundaries', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('uses the earliest first high temperature of 12+ previous cycles minus 8 days', () => {
    // Act
    const preOvulatoryEnd = preOvulatoryEndInLatestCycle(15)

    // Assert
    expect(preOvulatoryEnd).toBe(onCycleDayOfLatestCycle(15, 6).toString())
  })

  test('keeps the 5-day rule with fewer than 12 previous cycles', () => {
    // Act
    const preOvulatoryEnd = preOvulatoryEndInLatestCycle(4)

    // Assert
    expect(preOvulatoryEnd).toBe(onCycleDayOfLatestCycle(4, 5).toString())
  })
})
