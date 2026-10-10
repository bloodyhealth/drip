import notifee from '@notifee/react-native'
import {
  advanceNoticeDaysObservable,
  periodReminderObservable,
  tempReminderObservable,
} from '../../../local-storage'
import { setupReminders } from '../setup-reminders'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

const mockAddListener = jest.fn()
const mockRemoveListener = jest.fn()
jest.mock('../../../db', () => ({
  getBleedingDaysSortedByDate: () => ({
    addListener: mockAddListener,
    removeListener: mockRemoveListener,
  }),
}))

// prediction is computed from the db
jest.mock('../../cycle', () => () => ({
  getPredictedMenses: () => [],
}))

const flushPromises = () => new Promise<void>((r) => setTimeout(r, 0))

const changeBleedingDays = (changes: Record<string, unknown[]>): void => {
  const [[listener]] = mockAddListener.mock.calls
  listener(undefined, changes)
}

describe('setupReminders', () => {
  let teardown: () => void

  beforeEach(() => {
    jest.clearAllMocks()
    periodReminderObservable.set({ enabled: true })
    teardown = setupReminders()
  })

  afterEach(() => {
    teardown()
  })

  it.each([
    {
      input: 'period reminder',
      change: () => periodReminderObservable.set({ enabled: false }),
    },
    {
      input: 'advance notice days',
      change: () => advanceNoticeDaysObservable.set(4),
    },
  ])(
    'triggers a period reminder update when $input changes',
    async ({ change }) => {
      // Act
      change()
      await flushPromises()

      // Assert
      expect(notifee.cancelNotification).toHaveBeenCalledWith('period')
    }
  )

  it('triggers a period reminder update when bleeding days change', async () => {
    // Act
    changeBleedingDays({ insertions: [1], modifications: [], deletions: [] })
    await flushPromises()

    // Assert
    expect(notifee.cancelNotification).toHaveBeenCalledWith('period')
  })

  it('ignores bleeding day events without changes', async () => {
    // Act
    changeBleedingDays({ insertions: [], modifications: [], deletions: [] })
    await flushPromises()

    // Assert
    expect(notifee.cancelNotification).not.toHaveBeenCalled()
  })

  it('triggers a temperature reminder update when it changes', async () => {
    // Act
    tempReminderObservable.set({ enabled: false })
    await flushPromises()

    // Assert
    expect(notifee.cancelNotification).toHaveBeenCalledWith('temperature')
  })

  it('stops listening after teardown', async () => {
    // Act
    teardown()
    periodReminderObservable.set({ enabled: false })
    tempReminderObservable.set({ enabled: false })
    await flushPromises()

    // Assert
    expect(mockRemoveListener).toHaveBeenCalledTimes(1)
    expect(notifee.cancelNotification).not.toHaveBeenCalled()
  })
})
