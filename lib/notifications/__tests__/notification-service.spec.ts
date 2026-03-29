import '../../../i18n/i18n'
import { NotificationService } from '../notification-service'
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  NotificationSettings,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native'
import { Colors } from '../../../styles'
import { NotificationConfig } from '../types.ts'

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

describe('NotificationService', () => {
  let service: NotificationService

  beforeEach(() => {
    service = new NotificationService()
    jest.clearAllMocks()

    mockedNotifee.getNotificationSettings.mockResolvedValue({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
    } as NotificationSettings)
    // Mock console.error to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('scheduleNotification', () => {
    const mockNotificationConfig: NotificationConfig = {
      id: 'period',
      title: 'Test Notification',
      body: 'Test body',
      channel: {
        id: 'period',
        name: 'period-channel',
        importance: AndroidImportance.DEFAULT,
      },
      data: {
        screen: 'Home',
      },
    }

    const expectedNotificationConfig = {
      id: mockNotificationConfig.id,
      title: mockNotificationConfig.title,
      body: mockNotificationConfig.body,
      data: mockNotificationConfig.data,
      android: {
        channelId: 'period',
        color: Colors.purple,
        lightUpScreen: true,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        smallIcon: 'ic_notification',
      },
    }

    it('schedules a notification with timestamp', async () => {
      const timestamp = Date.now()

      await service.scheduleNotification(mockNotificationConfig, timestamp)

      expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(1)
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expectedNotificationConfig,
        {
          type: TriggerType.TIMESTAMP,
          timestamp,
        }
      )
    })

    it('schedules a notification with repeatFrequency', async () => {
      const timestamp = Date.now()
      const repeatFrequency = RepeatFrequency.DAILY

      await service.scheduleNotification(
        mockNotificationConfig,
        timestamp,
        repeatFrequency
      )

      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expectedNotificationConfig,
        {
          type: TriggerType.TIMESTAMP,
          timestamp,
          repeatFrequency,
        }
      )
    })

    it('handles errors gracefully', async () => {
      const error = new Error('Notification failed')
      mockedNotifee.createTriggerNotification.mockRejectedValueOnce(error)
      const timestamp = Date.now()

      await service.scheduleNotification(mockNotificationConfig, timestamp)

      expect(console.error).toHaveBeenCalledWith(
        'Error scheduling notification:',
        error
      )
    })
  })

  describe('cancelNotification', () => {
    it('cancels a notification by id', async () => {
      const notificationId = 'period'

      await service.cancelNotification(notificationId)

      expect(notifee.cancelNotification).toHaveBeenCalledTimes(1)
      expect(notifee.cancelNotification).toHaveBeenCalledWith(notificationId)
    })

    it('handles errors gracefully', async () => {
      const error = new Error('Cancel failed')
      mockedNotifee.cancelNotification.mockRejectedValueOnce(error)
      const notificationId = 'period'

      await service.cancelNotification(notificationId)

      expect(console.error).toHaveBeenCalledWith(
        `Error canceling notification of type: ${notificationId}`,
        error
      )
    })
  })
})
