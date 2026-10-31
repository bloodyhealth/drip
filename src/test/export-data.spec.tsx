import React from 'react'
import * as fs from '@dr.pogodin/react-native-fs'
import Share from 'react-native-share'
import Button from '@/components/common/button'
import ExportData from '@/components/settings/data-management/export-data'
import { freezeTime, unfreezeTime } from './freeze-time'
import { fireEvent, render, screen, waitFor } from './test-utils'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

jest.mock('@/db', () => ({
  getCycleDaysSortedByDate: jest.fn(() => []),
  getSchema: jest.fn(() => ({ CycleDay: { date: { type: 'string' } } })),
  mapRealmObjToJsObj: jest.fn(() => [{ date: '2025-01-15' }]),
}))

jest.mock('@dr.pogodin/react-native-fs', () => ({
  TemporaryDirectoryPath: '/tmp',
  writeFile: jest.fn(() => Promise.resolve()),
}))

jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve()),
}))

const exportAt = async (now: string): Promise<void> => {
  freezeTime(now)
  render(
    <ExportData
      setIsLoading={jest.fn()}
      closePasswordConfirmation={jest.fn()}
    />
  )
  fireEvent.press(screen.UNSAFE_getByType(Button))
  await waitFor(() => expect(Share.open).toHaveBeenCalled())
}

describe('ExportData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    unfreezeTime()
  })

  it.each([
    {
      now: '2025-01-15T09:00:00+01:00',
      expectedFileName: 'drip-data-2025-01-15.csv',
      expected: 'names the file after the current date',
    },
    {
      now: '2025-01-16T00:30:00+01:00',
      expectedFileName: 'drip-data-2025-01-16.csv',
      expected: 'uses the local date shortly after midnight',
    },
    {
      now: '2025-01-15T23:59:59.999+01:00',
      expectedFileName: 'drip-data-2025-01-15.csv',
      expected: 'uses the local date shortly before midnight',
    },
  ])('$expected', async ({ now, expectedFileName }) => {
    // Act
    await exportAt(now)

    // Assert
    const expectedPath = `/tmp/${expectedFileName}`
    expect(fs.writeFile).toHaveBeenCalledWith(expectedPath, expect.any(String))
    expect(Share.open).toHaveBeenCalledWith(
      expect.objectContaining({ url: `file://${expectedPath}` })
    )
  })
})
