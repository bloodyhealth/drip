import '../../../i18n/i18n'
import { NotificationService } from '../notification-service'
import notifee, {
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native'
import { setupPeriodNotifications } from '../period'
import { setupTemperatureNotifications } from '../temperature'
import { CHANNELS, NOTIFICATION_TYPE } from '../constants'

// Mock notifee
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(() => Promise.resolve()),
    createTriggerNotification: jest.fn(() =>
      Promise.resolve('notification-id')
    ),
    getNotificationSettings: jest.fn(),
    cancelNotification: jest.fn(() => Promise.resolve()),
    getTriggerNotifications: jest.fn(() => Promise.resolve([])),
    createChannel: jest.fn(() => Promise.resolve()),
  },
  TriggerType: {
    TIMESTAMP: 0,
  },
  AuthorizationStatus: {
    AUTHORIZED: 1,
  },
  AndroidImportance: {
    HIGH: 4,
  },
}))

// Mock setup functions
jest.mock('../period', () => ({
  setupPeriodNotifications: jest.fn(() => Promise.resolve()),
}))

jest.mock('../temperature', () => ({
  setupTemperatureNotifications: jest.fn(() => Promise.resolve()),
}))

describe('NotificationService', () => {
  let service

  beforeEach(() => {
    service = new NotificationService()
    jest.clearAllMocks()

    notifee.getNotificationSettings.mockResolvedValue({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
    })
    // Mock console.error to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('initialize', () => {
    it('requests permission and sets up notifications when not initialized', async () => {
      notifee.getNotificationSettings.mockResolvedValue({
        authorizationStatus: AuthorizationStatus.DENIED,
      })
      await service.initialize()

      expect(notifee.requestPermission).toHaveBeenCalledTimes(1)
      expect(setupPeriodNotifications).toHaveBeenCalledTimes(1)
      expect(setupTemperatureNotifications).toHaveBeenCalledTimes(1)
    })

    it('does not initialize twice if already initialized', async () => {
      notifee.getNotificationSettings.mockResolvedValue({
        authorizationStatus: AuthorizationStatus.DENIED,
      })
      await service.initialize()
      await service.initialize()

      expect(notifee.requestPermission).toHaveBeenCalledTimes(1)
      expect(setupPeriodNotifications).toHaveBeenCalledTimes(1)
      expect(setupTemperatureNotifications).toHaveBeenCalledTimes(1)
    })
  })

  describe('scheduleNotification', () => {
    const mockNotificationValue = {
      title: 'Test Notification',
      body: 'Test body',
      android: {
        smallIcon: 'test-icon',
        channelId: 'test-channel',
        color: 'test-color',
      },
      data: {
        screen: 'test-screen',
        notificationType: CHANNELS.PERIOD,
      },
    }

    it('schedules a notification with timestamp', async () => {
      const timestamp = Date.now()

      await service.scheduleNotification(mockNotificationValue, timestamp)

      expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(1)
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        mockNotificationValue,
        {
          type: TriggerType.TIMESTAMP,
          timestamp,
        }
      )
    })

    it('schedules a notification with repeatFrequency', async () => {
      const timestamp = Date.now()
      const repeatFrequency = 'DAILY'

      await service.scheduleNotification(
        mockNotificationValue,
        timestamp,
        repeatFrequency
      )

      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        mockNotificationValue,
        {
          type: TriggerType.TIMESTAMP,
          timestamp,
          repeatFrequency,
        }
      )
    })

    it('does not schedule notification if timestamp is falsy', async () => {
      await service.scheduleNotification(mockNotificationValue, null)
      await service.scheduleNotification(mockNotificationValue, undefined)
      await service.scheduleNotification(mockNotificationValue, 0)

      expect(notifee.createTriggerNotification).not.toHaveBeenCalled()
    })

    it('handles errors gracefully', async () => {
      const error = new Error('Notification failed')
      notifee.createTriggerNotification.mockRejectedValueOnce(error)
      const timestamp = Date.now()

      await service.scheduleNotification(mockNotificationValue, timestamp)

      expect(console.error).toHaveBeenCalledWith(
        'Error sending notification:',
        error
      )
    })
  })

  describe('cancelNotification', () => {
    it('cancels a notification by id', async () => {
      const notificationId = 'test-notification-id'

      await service.cancelNotification(notificationId)

      expect(notifee.cancelNotification).toHaveBeenCalledTimes(1)
      expect(notifee.cancelNotification).toHaveBeenCalledWith(notificationId)
    })

    it('handles errors gracefully', async () => {
      const error = new Error('Cancel failed')
      notifee.cancelNotification.mockRejectedValueOnce(error)
      const notificationId = 'test-notification-id'

      await service.cancelNotification(notificationId)

      expect(console.error).toHaveBeenCalledWith(
        `Error canceling notification with id $: ${notificationId}`,
        error
      )
    })
  })

  describe('cancelNotifications', () => {
    it('cancels all notifications for a given notification type', async () => {
      const mockNotifications = [
        {
          notification: {
            id: 'notification-1',
            data: { type: NOTIFICATION_TYPE.TEMPERATURE },
          },
        },
        {
          notification: {
            id: 'notification-2',
            data: { type: NOTIFICATION_TYPE.TEMPERATURE },
          },
        },
        {
          notification: {
            id: 'notification-3',
            data: { type: NOTIFICATION_TYPE.PERIOD },
          },
        },
      ]

      notifee.getTriggerNotifications.mockResolvedValueOnce(mockNotifications)

      await service.cancelNotifications(NOTIFICATION_TYPE.TEMPERATURE)

      expect(notifee.getTriggerNotifications).toHaveBeenCalledTimes(1)
      expect(notifee.cancelNotification).toHaveBeenCalledTimes(2)
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notification-1')
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notification-2')
      expect(notifee.cancelNotification).not.toHaveBeenCalledWith(
        'notification-3'
      )
    })

    it('does nothing if channel does not exist in CHANNELS', async () => {
      await service.cancelNotifications('INVALID_CHANNEL')

      expect(notifee.getTriggerNotifications).not.toHaveBeenCalled()
      expect(notifee.cancelNotification).not.toHaveBeenCalled()
    })

    it('handles empty notifications list', async () => {
      notifee.getTriggerNotifications.mockResolvedValueOnce([])

      await service.cancelNotifications(NOTIFICATION_TYPE.PERIOD)

      expect(notifee.getTriggerNotifications).toHaveBeenCalledTimes(1)
      expect(notifee.cancelNotification).not.toHaveBeenCalled()
    })

    it('handles errors gracefully', async () => {
      const error = new Error('Get notifications failed')
      notifee.getTriggerNotifications.mockRejectedValueOnce(error)

      await service.cancelNotifications(NOTIFICATION_TYPE.PERIOD)

      expect(console.error).toHaveBeenCalledWith(
        'Error canceling notifications:',
        error
      )
    })
  })

  describe('createChannel', () => {
    it('creates a channel for valid channel type', async () => {
      await service.createChannel(NOTIFICATION_TYPE.PERIOD)

      expect(notifee.createChannel).toHaveBeenCalledTimes(1)
      expect(notifee.createChannel).toHaveBeenCalledWith(
        CHANNELS[NOTIFICATION_TYPE.PERIOD]
      )
    })

    it('does nothing if channel does not exist in CHANNELS', async () => {
      await service.createChannel('INVALID_CHANNEL')

      expect(notifee.createChannel).not.toHaveBeenCalled()
    })

    it('handles errors gracefully', async () => {
      const error = new Error('Create channel failed')
      notifee.createChannel.mockRejectedValueOnce(error)

      await service.createChannel(NOTIFICATION_TYPE.PERIOD)

      expect(console.error).toHaveBeenCalledWith(
        'Error creating channel:',
        error
      )
    })
  })
})
