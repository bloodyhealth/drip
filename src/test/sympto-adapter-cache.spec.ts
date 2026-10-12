import getFertilityStatus from 'sympto'

import { makeCycle, makeFixtureDb } from './fixtures/cycle-days'
import { simulateDbWrite } from './fixtures/db-mock'
import { countSymptoCallsFromApp } from './fixtures/sympto-calls'

const mockFixtureDb = makeFixtureDb([
  makeCycle('2023-01-01', 31),
  makeCycle('2023-02-01', 28),
  makeCycle('2023-03-01', 20),
])

jest.mock('sympto', () =>
  jest.fn(jest.requireActual<typeof import('sympto')['default']>('sympto'))
)
jest.mock('../local-storage', () =>
  require('./fixtures/local-storage-mock').makeLocalStorageMock()
)
jest.mock('../db', () =>
  require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb)
)

import { useCervixAsSecondarySymptomObservable } from '../local-storage'
import {
  getCycleStatusForDay,
  getFertilityStatusForDay,
} from '../lib/sympto-adapter'

const TODAY = '2023-03-20'

describe('sympto adapter cache', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date(`${TODAY}T12:00:00Z`) })
    useCervixAsSecondarySymptomObservable.value = false
    simulateDbWrite()
    jest.mocked(getFertilityStatus).mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('computes the status of a cycle only once while nothing changes', () => {
    // Act
    const first = getFertilityStatusForDay(TODAY)
    const second = getFertilityStatusForDay(TODAY)

    // Assert
    expect(second).toEqual(first)
    expect(countSymptoCallsFromApp()).toBe(1)
  })

  test('shares the status between days of the same cycle', () => {
    // Act
    getCycleStatusForDay('2023-03-03')
    getCycleStatusForDay(TODAY)

    // Assert
    expect(countSymptoCallsFromApp()).toBe(1)
  })

  test('recomputes after data was written', () => {
    // Arrange
    getFertilityStatusForDay(TODAY)

    // Act
    simulateDbWrite()
    getFertilityStatusForDay(TODAY)

    // Assert
    expect(countSymptoCallsFromApp()).toBe(2)
  })

  test('recomputes on a new day', () => {
    // Arrange
    getFertilityStatusForDay(TODAY)

    // Act
    jest.setSystemTime(new Date('2023-03-21T12:00:00Z'))
    getFertilityStatusForDay('2023-03-21')

    // Assert
    expect(countSymptoCallsFromApp()).toBe(2)
  })

  test('recomputes when the secondary symptom setting changes', () => {
    // Arrange
    getFertilityStatusForDay(TODAY)

    // Act
    useCervixAsSecondarySymptomObservable.value = true
    getFertilityStatusForDay(TODAY)

    // Assert
    expect(countSymptoCallsFromApp()).toBe(2)
  })

  test('keeps statuses with and without earlier cycles apart', () => {
    // Act
    const withEarlier = getCycleStatusForDay(TODAY)
    const withoutEarlier = getCycleStatusForDay(TODAY, {
      excludeEarlierCycles: true,
    })

    // Assert
    expect(countSymptoCallsFromApp()).toBe(2)
    expect(withoutEarlier).not.toBe(withEarlier)
  })
})
