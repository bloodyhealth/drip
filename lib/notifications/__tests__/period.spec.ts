import {
  periodReminderObservable,
  advanceNoticeDaysObservable,
} from '../../../local-storage'
import { setupPeriodNotifications } from '../period'
import { NotificationType } from '../types.ts'
import { NotificationService } from '../notification-service.ts'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

// Mock NotificationService
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

// Mock cycleModule
const mockGetPredictedMenses = jest.fn()
jest.mock('../../cycle', () => () => ({
  getPredictedMenses: mockGetPredictedMenses,
}))

// Mock getBleedingDaysSortedByDate
const mockAddListener = jest.fn()
jest.mock('../../../db', () => ({
  getBleedingDaysSortedByDate: () => ({
    addListener: mockAddListener,
  }),
}))

describe('Test period notifications', () => {
  beforeAll(async () => {
    await setupPeriodNotifications()
    // Verify setup was called
    expect(mockAddListener).toHaveBeenCalled()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock Date.now() to return a fixed date: 2025-01-01 08:00:00 UTC
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('2025-01-01T08:00:00.000Z').getTime())

    // Reset observables to ensure callbacks fire when we change them
    advanceNoticeDaysObservable.set(3)
    periodReminderObservable.set({ enabled: false })
    mockGetPredictedMenses.mockReturnValue([])

    // Clear any calls from the setup
    mockCancelNotification.mockClear()
    mockScheduleNotification.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when reminder is disabled', () => {
    it('does not schedule notification when reminder is disabled', async () => {
      // First enable to set up state, then disable
      periodReminderObservable.set({ enabled: true })

      await new Promise<void>((resolve) => setTimeout(resolve, 200))

      mockCancelNotification.mockClear()
      mockScheduleNotification.mockClear()

      mockGetPredictedMenses.mockReturnValue([['2025-01-10']])
      periodReminderObservable.set({ enabled: false })

      // Wait for async operations
      await sleep(200)

      expect(mockScheduleNotification).not.toHaveBeenCalled()
      expect(mockCancelNotification).toHaveBeenCalledWith('period')
    })
  })

  describe('when reminder is enabled', () => {
    const expectedNotification = expect.objectContaining({
      title: expect.any(String),
      body: expect.any(String),
      channel: expect.objectContaining({
        id: 'period',
        name: expect.any(String),
        importance: expect.any(Number),
      }),
      data: expect.objectContaining({
        screen: 'Home',
      }),
    })
    it('does not schedule notification when there are no predictions', async () => {
      mockGetPredictedMenses.mockReturnValue([])
      periodReminderObservable.set({ enabled: true })

      // Wait for async operations
      await sleep(200)

      expect(mockScheduleNotification).not.toHaveBeenCalled()
    })

    it('schedules a notification only for the next future prediction when there are multiple', async () => {
      // Advance notice: 3 days
      mockGetPredictedMenses.mockReturnValue([
        ['2025-01-10', '2025-01-11', '2025-01-12', '2025-01-13', '2025-01-14'], // Reminder date: 2025-01-07 06:00:00 UTC
        ['2025-02-10', '2025-02-11', '2025-02-12', '2025-02-13', '2025-02-14'], // Reminder date: 2025-02-07 06:00:00 UTC
        ['2025-03-10', '2025-03-11', '2025-03-12', '2025-03-13', '2025-03-14'], // Reminder date: 2025-03-07 06:00:00 UTC
      ])
      periodReminderObservable.set({ enabled: true })

      // Wait for async operations
      await sleep(200)

      // Only the next upcoming prediction (first in the list) should be scheduled
      expect(mockScheduleNotification).toHaveBeenCalledTimes(1)
      expect(mockScheduleNotification).toHaveBeenCalledWith(
        expectedNotification,
        1736226000000 // 2025-01-07 06:00:00 GMT+01:00
      )
    })

    it('does not schedule notification when reminder date is in the past', async () => {
      // Prediction starts on 2025-01-02 (tomorrow)
      // Current date: 2025-01-01 08:00:00 UTC
      // Advance notice: 3 days
      // Reminder date: 2024-12-29 06:00:00 UTC (in the past)
      mockGetPredictedMenses.mockReturnValue([['2025-01-02']])
      periodReminderObservable.set({ enabled: true })

      // Wait for async operations
      await sleep(200)

      expect(mockScheduleNotification).not.toHaveBeenCalled()
    })

    it('schedules notification with different advance notice days', async () => {
      advanceNoticeDaysObservable.set(5)
      // Wait for the callback from advanceNoticeDaysObservable to complete
      await sleep(100)
      // Prediction starts on 2025-01-15
      // Advance notice: 5 days
      // Reminder date: 2025-01-10 06:00:00 local time
      mockGetPredictedMenses.mockReturnValue([['2025-01-15']])
      mockCancelNotification.mockClear()
      mockScheduleNotification.mockClear()
      periodReminderObservable.set({ enabled: true })

      // Wait for async operations
      await sleep(200)

      expect(mockScheduleNotification).toHaveBeenCalledTimes(1)

      const [notificationValue, timestamp] =
        mockScheduleNotification.mock.calls[0]

      expect(notificationValue).toEqual(expectedNotification)
      expect(timestamp).toBe(1736485200000) // 2025-01-10 06:00:00 GMT+01:00
    })

    it('cancels existing notifications before scheduling new ones', async () => {
      mockGetPredictedMenses.mockReturnValue([['2025-01-10']])
      mockCancelNotification.mockClear()
      mockScheduleNotification.mockClear()
      periodReminderObservable.set({ enabled: true })

      // Wait for async operations
      await sleep(200)

      // cancelNotifications should be called before scheduleNotification
      expect(mockCancelNotification).toHaveBeenCalledTimes(1)
      expect(mockCancelNotification).toHaveBeenCalledWith('period')
      expect(mockScheduleNotification).toHaveBeenCalledTimes(1)

      const cancelCallIndex = mockCancelNotification.mock.invocationCallOrder[0]
      const scheduleCallIndex =
        mockScheduleNotification.mock.invocationCallOrder[0]

      expect(cancelCallIndex).toBeLessThan(scheduleCallIndex)
    })
  })
})

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))
