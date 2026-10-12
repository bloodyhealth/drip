import * as React from 'react'
import { render } from '@testing-library/react-native'
import getFertilityStatus from 'sympto'

import { makeCycle, makeFixtureDb } from './fixtures/cycle-days'
import { countSymptoCallsFromApp } from './fixtures/sympto-calls'

const mockFixtureDb = makeFixtureDb([
  makeCycle('2024-01-01', 28),
  makeCycle('2024-01-29', 28),
  makeCycle('2024-02-26', 28),
  makeCycle('2024-03-25', 17),
])

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: () => true,
  useNavigation: () => ({ navigate: jest.fn() }),
}))
jest.mock('sympto', () =>
  jest.fn(jest.requireActual<typeof import('sympto')['default']>('sympto'))
)
jest.mock('../local-storage', () =>
  require('./fixtures/local-storage-mock').makeLocalStorageMock()
)
jest.mock('../db', () => ({
  ...require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb),
  getSymptomsWithData: () => ['bleeding', 'temperature', 'mucus'],
  getAmountOfCycleDays: () => 100,
}))

import CycleChart from '../components/chart/chart'

describe('CycleChart', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date('2024-04-10T12:00:00Z') })
    jest.mocked(getFertilityStatus).mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('computes the fertility status at most once per cycle when rendering columns', () => {
    // Arrange
    const numberOfCycles = mockFixtureDb.cycleStartsSortedByDate.length

    // Act
    render(<CycleChart />)

    // Assert
    const calls = countSymptoCallsFromApp()
    expect(calls).toBeGreaterThan(0)
    expect(calls).toBeLessThanOrEqual(numberOfCycles)
  })
})
