import { tempReminderObservable } from '../../../local-storage'
import { setupTemperatureNotifications } from '../temperature'
import { RepeatFrequency } from '@notifee/react-native'
import { NotificationType } from '../types.ts'
import { NotificationService } from '../notification-service.ts'

const mockCancelNotification = jest.fn((_: NotificationType) =>
  Promise.resolve()
)
const mockScheduleNotification = jest.fn(
  (
    ..._: Parameters<typeof NotificationService.prototype.scheduleNotification>
  ) => Promise.resolve()
)

jest.mock('../notification-service', () => ({
  __esModule: true,
  default: {
    cancelNotification: (id: NotificationType) => mockCancelNotification(id),
    scheduleNotification: (
      ...args: Parameters<
        typeof NotificationService.prototype.scheduleNotification
      >
    ) => mockScheduleNotification(...args),
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

      expect(mockCancelNotification).toHaveBeenCalledTimes(1)
      expect(mockCancelNotification).toHaveBeenCalledWith('temperature')
    })

    it('does not schedule notification when reminder is disabled', async () => {
      mockCancelNotification.mockClear()
      mockScheduleNotification.mockClear()
      tempReminderObservable.set({ enabled: false, time: '09:00' })

      expect(mockCancelNotification).toHaveBeenCalledTimes(1)
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

      await new Promise<void>((resolve) => setTimeout(resolve, 200))

      expect(mockScheduleNotification).toHaveBeenCalledTimes(1)
      expect(mockScheduleNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'temperature',
          title: expect.any(String),
          body: expect.any(String),
          channel: expect.objectContaining({
            id: 'temperature',
            name: expect.any(String),
            importance: expect.any(Number),
          }),
          data: expect.objectContaining({
            screen: 'TemperatureEditView',
          }),
        }),
        expectedTimestamp,
        RepeatFrequency.DAILY
      )

      jest.useRealTimers()
    })
  })
})
