import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  NotificationSettings,
  RepeatFrequency,
  TriggerType,
} from 'react-native-notify-kit'
import { Colors } from '../../../styles'
import {
  cancelReminder,
  ReminderContent,
  requestPermission,
  scheduleReminder,
} from '../notifications'

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const withAuthorization = (authorizationStatus: AuthorizationStatus): void => {
  mockedNotifee.getNotificationSettings.mockResolvedValue({
    authorizationStatus,
  } as NotificationSettings)
}

const createContent = (): ReminderContent => ({
  title: 'Title',
  body: 'Body',
  channelName: 'Channel',
  importance: AndroidImportance.DEFAULT,
})

describe('notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    withAuthorization(AuthorizationStatus.AUTHORIZED)
  })

  describe('requestPermission', () => {
    it('does not prompt when already authorized', async () => {
      // Act
      const isGranted = await requestPermission()

      // Assert
      expect(isGranted).toBe(true)
      expect(notifee.requestPermission).not.toHaveBeenCalled()
    })

    it('prompts when not authorized and returns the result', async () => {
      // Arrange
      withAuthorization(AuthorizationStatus.NOT_DETERMINED)
      mockedNotifee.requestPermission.mockResolvedValueOnce({
        authorizationStatus: AuthorizationStatus.DENIED,
      } as NotificationSettings)

      // Act
      const isGranted = await requestPermission()

      // Assert
      expect(notifee.requestPermission).toHaveBeenCalledTimes(1)
      expect(isGranted).toBe(false)
    })
  })

  describe('scheduleReminder', () => {
    it('creates the channel and a trigger notification with the reminder id', async () => {
      // Act
      await scheduleReminder('period', createContent(), 1000)

      // Assert
      expect(notifee.createChannel).toHaveBeenCalledWith({
        id: 'period',
        name: 'Channel',
        importance: AndroidImportance.DEFAULT,
      })
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        {
          id: 'period',
          title: 'Title',
          body: 'Body',
          android: {
            channelId: 'period',
            pressAction: { id: 'default', launchActivity: 'default' },
            smallIcon: 'ic_notification',
            color: Colors.purple,
            lightUpScreen: true,
          },
        },
        { type: TriggerType.TIMESTAMP, timestamp: 1000 }
      )
    })

    it('passes the repeat frequency to the trigger', async () => {
      // Act
      await scheduleReminder(
        'temperature',
        createContent(),
        1000,
        RepeatFrequency.DAILY
      )

      // Assert
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.anything(),
        {
          type: TriggerType.TIMESTAMP,
          timestamp: 1000,
          repeatFrequency: RepeatFrequency.DAILY,
        }
      )
    })

    it('skips scheduling without prompting when not authorized', async () => {
      // Arrange
      withAuthorization(AuthorizationStatus.DENIED)

      // Act
      await scheduleReminder('period', createContent(), 1000)

      // Assert
      expect(notifee.requestPermission).not.toHaveBeenCalled()
      expect(notifee.createTriggerNotification).not.toHaveBeenCalled()
    })
  })

  describe('cancelReminder', () => {
    it('cancels the notification with the reminder id', async () => {
      // Act
      await cancelReminder('temperature')

      // Assert
      expect(notifee.cancelNotification).toHaveBeenCalledWith('temperature')
    })
  })
})
