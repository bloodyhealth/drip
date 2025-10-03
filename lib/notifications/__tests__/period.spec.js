import {
  periodReminderObservable,
  advanceNoticeDaysObservable,
} from '../../../local-storage'
import notifee, { TriggerType } from '@notifee/react-native'
import { cancelNotifications } from '../channel'
import setupNotifications from '../setup'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

// Mock notifee with TriggerType
jest.mock('@notifee/react-native', () => ({
  createTriggerNotification: jest.fn().mockResolvedValue(undefined),
  requestPermission: jest.fn().mockResolvedValue(true),
  TriggerType: {
    TIMESTAMP: 1,
  },
  AndroidImportance: {
    HIGH: 4,
  },
}))

// Mock channel module
jest.mock('../channel', () => ({
  createChannel: jest.fn().mockResolvedValue(undefined),
  cancelNotifications: jest.fn().mockResolvedValue(undefined),
  CHANNELS: {
    TEMPERATURE: {
      id: 'temperature_reminder',
      name: 'Temperature Reminders',
      importance: 4,
    },
    PERIOD: {
      id: 'period_reminder',
      name: 'Period Predictions',
      importance: 4,
    },
  },
}))

// Mock cycleModule
const mockGetPredictedMenses = jest.fn()
jest.mock('../../cycle', () => () => ({
  getPredictedMenses: mockGetPredictedMenses,
}))

describe('Period Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock Date.now() to return a fixed date
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('2025-01-01').getTime())

    // Reset observables
    advanceNoticeDaysObservable.set(3)
    periodReminderObservable.set({ enabled: false })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('does not create notification when reminder is disabled', async () => {
    // Start with disabled notifications
    periodReminderObservable.set({ enabled: false })

    // Should not create any notifications
    expect(notifee.createTriggerNotification).not.toHaveBeenCalled()
  })

  test('creates notification for future prediction', async () => {
    // Set up the mock prediction
    mockGetPredictedMenses.mockReturnValue([['2025-01-10']])

    // Start with enabled notifications
    periodReminderObservable.set({ enabled: true })
    await setupNotifications()

    // Verify notification was created with exact expected object
    const expectedNotification = {
      title: 'Period Prediction',
      body: 'Testing period notification',
      android: {
        channelId: 'period_reminder',
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
      data: {
        screen: 'Home',
      },
    }

    const expectedTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: expect.any(Number),
    }

    // Check that createTriggerNotification was called exactly once with our expected arguments
    expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(1)
    expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
      expectedNotification,
      expectedTrigger
    )
  })

  test('cancels old notifications before creating new ones', async () => {
    // Start with enabled notifications
    periodReminderObservable.set({ enabled: true })

    // Should cancel notifications
    expect(cancelNotifications).toHaveBeenCalledWith('PERIOD')
  })
})
