import * as React from 'react'
import { render } from '@testing-library/react-native'
import { CalendarList } from 'react-native-calendars'

import { makeCycle, makeCycleDay, makeFixtureDb } from './fixtures/cycle-days'
import { simulateDbWrite } from './fixtures/db-mock'

const mockFixtureDb = makeFixtureDb([
  makeCycle('2023-01-01', 31),
  makeCycle('2023-02-01', 28),
  makeCycle('2023-03-01', 31),
  makeCycle('2023-04-01', 20),
])

jest.mock('react-native-calendars', () => ({
  CalendarList: jest.fn(() => null),
}))
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true,
  useNavigation: () => ({ navigate: jest.fn() }),
}))
jest.mock('../local-storage', () =>
  require('./fixtures/local-storage-mock').makeLocalStorageMock()
)
jest.mock('../db', () => ({
  ...require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb),
  getBleedingDaysSortedByDate: () => mockFixtureDb.bleedingDaysSortedByDate,
}))

import CalendarView from '../components/calendar'
import { periodPredictionObservable } from '../local-storage'

type MarkedDates = Record<string, { customStyles: object }>

function lastMarkedDates(): MarkedDates {
  const calls = jest.mocked(CalendarList).mock.calls
  const [props] = calls[calls.length - 1] as unknown as [
    { markedDates: MarkedDates }
  ]
  return props.markedDates
}

describe('CalendarView', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date('2023-04-20T12:00:00Z') })
    periodPredictionObservable.value = true
    simulateDbWrite()
    jest.mocked(CalendarList).mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('marks bleeding days, today and predicted bleeding days', () => {
    // Act
    render(<CalendarView />)

    // Assert
    const markedDates = lastMarkedDates()
    expect(markedDates['2023-04-01']).toBeDefined()
    expect(markedDates['2023-04-20']).toBeDefined()
    expect(markedDates['2023-05-01']).toBeDefined()
  })

  test('keeps the same markings when re-rendered without changes', () => {
    // Arrange
    const { rerender } = render(<CalendarView />)
    const before = lastMarkedDates()

    // Act
    rerender(<CalendarView />)

    // Assert
    expect(lastMarkedDates()).toBe(before)
  })

  test('rebuilds the markings after data was written', () => {
    // Arrange
    const { rerender } = render(<CalendarView />)
    const newBleedingDay = makeCycleDay('2023-04-19', 19)
    newBleedingDay.bleeding = { value: 1, exclude: false }
    mockFixtureDb.bleedingDaysSortedByDate.unshift(newBleedingDay)

    // Act
    simulateDbWrite()
    rerender(<CalendarView />)

    // Assert
    expect(lastMarkedDates()['2023-04-19']).toBeDefined()
    mockFixtureDb.bleedingDaysSortedByDate.shift()
  })

  test('rebuilds the markings on a new day', () => {
    // Arrange
    const { rerender } = render(<CalendarView />)
    const before = lastMarkedDates()

    // Act
    jest.setSystemTime(new Date('2023-04-21T12:00:00Z'))
    rerender(<CalendarView />)

    // Assert
    expect(lastMarkedDates()).not.toBe(before)
  })

  test('rebuilds the markings when period predictions are turned off', () => {
    // Arrange
    const { rerender } = render(<CalendarView />)

    // Act
    periodPredictionObservable.value = false
    rerender(<CalendarView />)

    // Assert
    expect(lastMarkedDates()['2023-05-01']).toBeUndefined()
  })
})
