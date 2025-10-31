import { tempReminderObservable } from '../../../local-storage'
import { setupTemperatureNotifications } from '../temperature'
import { NOTIFICATION_TYPE } from '../constants'
import { RepeatFrequency } from '@notifee/react-native'

// Mock @notifee/react-native BEFORE importing anything that uses it
// We only need RepeatFrequency, but the module tries to initialize native bindings when imported
// Also need AndroidImportance since constants.js imports it
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  RepeatFrequency: {
    DAILY: 'DAILY',
  },
  AndroidImportance: {
    HIGH: 4,
  },
}))

// Mock NotificationService
const mockCreateChannel = jest.fn(() => Promise.resolve())
const mockCancelNotifications = jest.fn(() => Promise.resolve())
const mockScheduleNotification = jest.fn(() => Promise.resolve())

jest.mock('../notification-service', () => ({
  __esModule: true,
  default: {
    createChannel: (...args) => mockCreateChannel(...args),
    cancelNotifications: (...args) => mockCancelNotifications(...args),
    scheduleNotification: (...args) => mockScheduleNotification(...args),
  },
}))

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

describe('Test temperature notifications', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe('reminder observer callback', () => {
    beforeAll(async () => {
      await setupTemperatureNotifications()
    })

    it('cancels old notifications when reminder changes', async () => {
      tempReminderObservable.set({ enabled: true, time: '09:00' })

      expect(mockCancelNotifications).toHaveBeenCalledTimes(1)
      expect(mockCancelNotifications).toHaveBeenCalledWith(
        NOTIFICATION_TYPE.TEMPERATURE
      )
    })

    it('does not schedule notification when reminder is disabled', async () => {
      mockCancelNotifications.mockClear()
      mockScheduleNotification.mockClear()
      tempReminderObservable.set({ enabled: false, time: '09:00' })

      expect(mockCancelNotifications).toHaveBeenCalledTimes(1)
      expect(mockScheduleNotification).not.toHaveBeenCalled()
    })

    it.each([
      {
        time: '07:00',
        expectedTimestamp: 1737007200000, // 2025-01-15T07:00:00.000Z (7 AM GMT+1, same day)
        expected: 'schedule reminder for next day',
      },
      {
        time: '09:00',
        expectedTimestamp: 1736928000000, // 2025-01-15T09:00:00.000Z (9 AM GMT+1, same day)
        expected: 'schedule reminder for same day',
      },
    ])('$expected', async ({ time, expectedTimestamp }) => {
      mockScheduleNotification.mockClear()
      const mockDate = new Date('2025-01-15T08:00:00.000Z')
      jest.useFakeTimers({ advanceTimers: true })
      jest.setSystemTime(mockDate)

      tempReminderObservable.set({ enabled: true, time })

      await new Promise((r) => setTimeout(r, 200))

      expect(mockScheduleNotification).toHaveBeenCalledTimes(1)
      expect(mockScheduleNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          body: expect.any(String),
          android: expect.objectContaining({
            channelId: 'temperature_reminder',
          }),
          data: expect.objectContaining({
            screen: 'TemperatureEditView',
            notificationType: NOTIFICATION_TYPE.TEMPERATURE,
          }),
        }),
        expectedTimestamp,
        RepeatFrequency.DAILY
      )

      jest.useRealTimers()
    })
  })
})
