import { setupTemperatureNotifications } from '../temperature'
import { tempReminderObservable } from '../../../local-storage'
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

// Mock i18n
jest.mock('../../../i18n/i18n', () => ({
  t: jest.fn().mockReturnValue('Test notification message'),
}))

describe('Temperature Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset observable with proper reminder structure
    tempReminderObservable.set({ enabled: false, time: '09:00' })
  })

  test('does not create notification when reminder is disabled', async () => {
    await setupNotifications()
    expect(notifee.createTriggerNotification).not.toHaveBeenCalled()
  })

  test('creates notification for temperature reminder', async () => {
    // Set up reminder with time
    tempReminderObservable.set({ enabled: true, time: '09:00' })
    await setupNotifications()

    // Verify notification was created with exact expected object
    const expectedNotification = {
      title: 'Meeting with Jane',
      body: 'Test notification message',
      android: {
        channelId: 'temperature_reminder',
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
      data: {
        screen: 'TemperatureEditView',
      },
    }

    const expectedTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: expect.any(Number),
    }

    expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
      expectedNotification,
      expectedTrigger
    )
  })

  test('cancels old notifications before creating new ones', async () => {
    tempReminderObservable.set({ enabled: true, time: '09:00' })
    await setupNotifications()
    expect(cancelNotifications).toHaveBeenCalledWith('TEMPERATURE')
  })
})
