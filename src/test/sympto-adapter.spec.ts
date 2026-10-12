import { LocalDate } from '@js-joda/core'

import { makeCycle, makeFixtureDb } from './fixtures/cycle-days'

const FIRST_START = LocalDate.parse('2023-01-01')
const monthStart = (i: number) => FIRST_START.plusMonths(i)

// 15 cycles, each starting on the 1st of a month. The oldest has its first
// high temperature on cycle day 14, all later ones on cycle day 15. The
// minus-8-day rule uses the earliest first high temperature of all previous
// cycles (once there are >= 12). Cycles stay within one month because sympto
// miscounts cycle days across month boundaries (js-joda compareTo).
const mockFixtureDb = makeFixtureDb(
  Array.from({ length: 15 }, (_, i) =>
    makeCycle(
      monthStart(i).toString(),
      monthStart(i).lengthOfMonth(),
      i === 0 ? 14 : 15
    )
  )
)
const LATEST_START = monthStart(14)
const onCycleDay = (n: number) => LATEST_START.plusDays(n - 1).toString()

jest.mock('../local-storage', () =>
  require('./fixtures/local-storage-mock').makeLocalStorageMock()
)
jest.mock('../db', () => ({
  ...require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb),
}))

import {
  getCycleStatusForDay,
  getFertilityStatusForDay,
} from '../lib/sympto-adapter'

describe('sympto adapter', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date(`${onCycleDay(20)}T12:00:00Z`) })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('uses all earlier cycles for the minus-8-day rule', () => {
    // Act
    const status = getCycleStatusForDay(onCycleDay(3))

    // Assert
    expect(status?.phases.preOvulatory?.end?.date).toBe(onCycleDay(6))
  })

  test('falls back to a 5-day pre-ovulatory phase when earlier cycles are excluded', () => {
    // Act
    const status = getCycleStatusForDay(onCycleDay(3), {
      excludeEarlierCycles: true,
    })

    // Assert
    expect(status?.phases.preOvulatory?.end?.date).toBe(onCycleDay(5))
  })

  test('returns null before the first cycle start', () => {
    // Act
    const status = getCycleStatusForDay('2022-12-31')

    // Assert
    expect(status).toBeNull()
  })

  test.each([
    [3, 1],
    [10, 2],
    [20, 3],
  ])('cycle day %i of the latest cycle is in phase %i', (cycleDay, phase) => {
    // Act
    const result = getFertilityStatusForDay(onCycleDay(cycleDay))

    // Assert
    expect(result.phase).toBe(phase)
  })

  test('marks the day before the first cycle start as unknown', () => {
    // Act
    const result = getFertilityStatusForDay('2022-12-31')

    // Assert
    expect(result.phase).toBeNull()
  })
})
