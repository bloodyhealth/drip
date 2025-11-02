import notifee, {
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native'
import { setupPeriodNotifications } from './period'
import { setupTemperatureNotifications } from './temperature'
import { CHANNELS } from './constants'
import { Colors } from '../../styles'

export class NotificationService {
  #isInitialized = false

  async initialize() {
    if (this.#isInitialized) {
      return
    }

    this.#isInitialized = true

    await this.requestPermissions()
    await setupPeriodNotifications()
    await setupTemperatureNotifications()
  }

  async requestPermissions() {
    const hasNotificationPermissions = await this.isAuthorized()
    if (!hasNotificationPermissions) {
      await notifee.requestPermission()
    }
  }

  async isAuthorized() {
    const { authorizationStatus } = await notifee.getNotificationSettings()
    return authorizationStatus >= AuthorizationStatus.AUTHORIZED
  }

  async scheduleNotification(
    notificationConfig,
    timestamp,
    repeatFrequency = null
  ) {
    if (!timestamp) return

    const { id, title, body, data, android = {} } = notificationConfig

    const isAuthorized = await this.isAuthorized()

    if (!isAuthorized) {
      await notifee.requestPermission()
    }

    const mergedConfig = {
      ...(id ? { id } : {}),
      title,
      body,
      android: {
        pressAction: {
          id: android.channelId,
          launchActivity: 'default',
        },
        smallIcon: 'ic_notification',
        color: Colors.purple,
        lightUpScreen: true,
        ...android,
      },
      data,
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
      ...(repeatFrequency && { repeatFrequency }),
    }

    try {
      const notificationId = await notifee.createTriggerNotification(
        mergedConfig,
        trigger
      )
      return notificationId
    } catch (error) {
      console.error('Error scheduling notification:', error)
      return null
    }
  }

  async cancelNotification(notificationId) {
    try {
      await notifee.cancelNotification(notificationId)
    } catch (error) {
      console.error(
        `Error canceling notification with id $: ${notificationId}`,
        error
      )
    }
  }

  async cancelNotifications(notificationType) {
    if (!CHANNELS[notificationType]?.id) return

    try {
      const scheduledNotifications = await notifee.getTriggerNotifications()

      scheduledNotifications
        .filter(
          ({ notification }) =>
            notification.data?.notificationType === notificationType
        )
        .forEach(({ notification }) =>
          notifee.cancelNotification(notification.id)
        )
    } catch (error) {
      console.error('Error canceling notifications:', error)
    }
  }

  async createChannel(channel) {
    if (!CHANNELS[channel]?.id) return

    try {
      await notifee.createChannel(CHANNELS[channel])
    } catch (error) {
      console.error('Error creating channel:', error)
    }
  }
}

export default new NotificationService()
