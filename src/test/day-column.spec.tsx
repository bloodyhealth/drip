import React from 'react'
import DayColumn from '@/components/chart/day-column'
import SymptomCell from '@/components/chart/symptom-cell'
import { render, screen } from './test-utils'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

jest.mock('@/db', () => ({
  getAmountOfCycleDays: jest.fn(() => 0),
  getBleedingDaysSortedByDate: jest.fn(() => []),
  getCycleDay: jest.fn(() => null),
  getCycleDaysSortedByDate: jest.fn(() => []),
  getCycleStartsSortedByDate: jest.fn(() => []),
}))

const renderDayColumn = (dateString: string): void => {
  render(
    <DayColumn
      dateString={dateString}
      chartSymptoms={['bleeding']}
      columnHeight={100}
      navigate={jest.fn()}
      setDate={jest.fn()}
      shouldShowTemperatureColumn={false}
      symptomHeight={10}
      symptomRowSymptoms={['bleeding']}
      xAxisHeight={10}
    />
  )
}

describe('DayColumn', () => {
  it.each([
    { dateString: '2025-01-10', isWeekend: false, day: 'Friday' },
    { dateString: '2025-01-11', isWeekend: true, day: 'Saturday' },
    { dateString: '2025-01-12', isWeekend: true, day: 'Sunday' },
    { dateString: '2025-01-13', isWeekend: false, day: 'Monday' },
    { dateString: '2024-02-29', isWeekend: false, day: 'Thursday (leap day)' },
    {
      dateString: '2025-03-30',
      isWeekend: true,
      day: 'Sunday (summer time starts)',
    },
    {
      dateString: '2025-10-26',
      isWeekend: true,
      day: 'Sunday (summer time ends)',
    },
    { dateString: '2025-12-31', isWeekend: false, day: 'Wednesday (year end)' },
  ])(
    'marks $dateString as weekend: $isWeekend ($day)',
    ({ dateString, isWeekend }) => {
      // Act
      renderDayColumn(dateString)

      // Assert
      expect(screen.UNSAFE_getByType(SymptomCell).props.isWeekend).toBe(
        isWeekend
      )
    }
  )
})
