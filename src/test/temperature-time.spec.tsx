import React from 'react'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Temperature from '@/components/cycle-day/temperature'
import { act, render, screen } from './test-utils'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

jest.mock('@/db', () => ({
  getPreviousTemperatureForDate: jest.fn(() => null),
}))

const confirmTime = (save: jest.Mock, jsDate: Date): void => {
  render(<Temperature data={{}} date="2025-01-15" save={save} />)
  const picker = screen.UNSAFE_getByType(DateTimePicker)
  act(() => picker.props.onConfirm(jsDate))
}

describe('Temperature time', () => {
  it.each([
    {
      jsDate: new Date(2025, 0, 15, 8, 30),
      expectedTime: '08:30',
      expected: 'saves the picked time as HH:mm',
    },
    {
      jsDate: new Date(2025, 0, 15, 8, 30, 45, 123),
      expectedTime: '08:30',
      expected: 'drops seconds and milliseconds',
    },
    {
      jsDate: new Date(2025, 0, 15, 23, 59, 59, 999),
      expectedTime: '23:59',
      expected: 'truncates instead of rounding up to the next minute',
    },
    {
      jsDate: new Date(2025, 0, 15, 0, 5),
      expectedTime: '00:05',
      expected: 'pads hours and minutes after midnight',
    },
    {
      jsDate: new Date(2025, 0, 15, 13, 0),
      expectedTime: '13:00',
      expected: 'uses the 24-hour clock',
    },
    {
      jsDate: new Date(2025, 2, 30, 3, 15),
      expectedTime: '03:15',
      expected: 'uses local time on the day summer time starts',
    },
    {
      jsDate: new Date('2025-10-26T02:30:00+01:00'),
      expectedTime: '02:30',
      expected: 'uses local time in the repeated hour when summer time ends',
    },
  ])('$expected', ({ jsDate, expectedTime }) => {
    // Arrange
    const save = jest.fn()

    // Act
    confirmTime(save, jsDate)

    // Assert
    expect(save).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith(expectedTime, 'time')
  })
})
