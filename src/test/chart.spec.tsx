import * as React from 'react'
import { FlatList } from 'react-native'
import { act, render, screen } from '@testing-library/react-native'
import getFertilityStatus from 'sympto'

import { makeCycle, makeFixtureDb } from './fixtures/cycle-days'
import { simulateDbWrite } from './fixtures/db-mock'
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
jest.mock('../db', () => {
  const dbMock = require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb)
  return {
    ...dbMock,
    getCycleModule: jest.fn(dbMock.getCycleModule),
    getSymptomsWithData: () => ['bleeding', 'temperature', 'mucus'],
    getAmountOfCycleDays: () => 100,
  }
})

import CycleChart from '../components/chart/chart'
import { CHART_COLUMN_WIDTH } from '../config'
import { getCycleModule } from '../db'
import i18n from '../i18n/i18n'
import { getChartFlag } from '../local-storage'

describe('CycleChart', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date('2024-04-10T12:00:00Z') })
    simulateDbWrite()
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

  test('does not re-render day columns when the chart re-renders without data changes', async () => {
    // Arrange
    jest.mocked(getChartFlag).mockResolvedValue('true')
    render(<CycleChart />)
    const dbReadsAfterFirstRender =
      jest.mocked(getCycleModule).mock.calls.length

    // Act
    await act(async () => {})

    // Assert
    expect(screen.getByText(i18n.t('chart.tutorial'))).toBeTruthy()
    expect(jest.mocked(getCycleModule).mock.calls.length).toBe(
      dbReadsAfterFirstRender
    )
  })

  test('lays out day columns with a fixed width', () => {
    // Arrange
    render(<CycleChart />)
    const list = screen.UNSAFE_getByType(FlatList)

    // Act
    const layout = list.props.getItemLayout?.(undefined, 3)

    // Assert
    expect(layout).toEqual({
      length: CHART_COLUMN_WIDTH,
      offset: 3 * CHART_COLUMN_WIDTH,
      index: 3,
    })
  })
})
