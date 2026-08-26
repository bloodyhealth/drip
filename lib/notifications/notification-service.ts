import notifee, {
  AuthorizationStatus,
  Notification,
  RepeatFrequency,
  Trigger,
  TriggerType,
} from '@notifee/react-native'
import { Colors } from '../../styles'
import { NotificationConfig, NotificationType } from './types.ts'

export class NotificationService {
  async requestPermissions(): Promise<boolean> {
    if (await this.isAuthorized()) return true

    const { authorizationStatus } = await notifee.requestPermission()
    return authorizationStatus >= AuthorizationStatus.AUTHORIZED
  }

  async isAuthorized(): Promise<boolean> {
    const { authorizationStatus } = await notifee.getNotificationSettings()
    return authorizationStatus >= AuthorizationStatus.AUTHORIZED
  }

  async scheduleNotification(
    config: NotificationConfig,
    timestamp: number,
    repeatFrequency?: RepeatFrequency
  ): Promise<boolean> {
    const isAuthorized = await this.requestPermissions()
    if (!isAuthorized) {
      console.warn('Notification permission denied — skipping schedule')
      return false
    }

    const channelId = await notifee.createChannel(config.channel)

    const notification: Notification = {
      id: config.id,
      title: config.title,
      body: config.body,
      data: config.data,
      android: {
        channelId,
        pressAction: { id: 'default', launchActivity: 'default' },
        smallIcon: 'ic_notification',
        color: Colors.purple,
        lightUpScreen: true,
      },
    }

    const trigger: Trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
      ...(repeatFrequency && { repeatFrequency }),
    }

    try {
      await notifee.createTriggerNotification(notification, trigger)
      return true
    } catch (error) {
      console.error('Error scheduling notification:', error)
      return false
    }
  }

  async cancelNotification(notificationType: NotificationType): Promise<void> {
    try {
      await notifee.cancelNotification(notificationType)
    } catch (error) {
      console.error(
        `Error canceling notification of type: ${notificationType}`,
        error
      )
    }
  }
}

export default new NotificationService()
