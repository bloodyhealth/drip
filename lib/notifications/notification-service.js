import notifee, {
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native'
import { setupPeriodNotifications } from './period'
import { setupTemperatureNotifications } from './temperature'
import { CHANNELS } from './constants'

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
    const hasNotificationPermissions = await this.isAllowedToNotify()
    if (!hasNotificationPermissions) {
      await notifee.requestPermission()
    }
  }

  async isAllowedToNotify() {
    const { authorizationStatus } = await notifee.getNotificationSettings()
    return authorizationStatus >= AuthorizationStatus.AUTHORIZED
  }

  async scheduleNotification(
    notificationValue,
    timestamp,
    repeatFrequency = null
  ) {
    if (!timestamp) return

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
      ...(repeatFrequency && { repeatFrequency }),
    }

    try {
      await notifee.createTriggerNotification(notificationValue, trigger)
    } catch (error) {
      console.error('Error sending notification:', error)
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
    if (!CHANNELS?.[notificationType]?.id) return

    try {
      const scheduledNotifications = await notifee.getTriggerNotifications()
      const notificationIdsForType = scheduledNotifications
        .filter(
          (notification) =>
            notification.notification.data?.type === notificationType
        )
        .map((notification) => notification.notification.id)
      notificationIdsForType.forEach((notificationId) =>
        notifee.cancelNotification(notificationId)
      )
    } catch (error) {
      console.error('Error canceling notifications:', error)
    }
  }

  async createChannel(channel) {
    if (!CHANNELS?.[channel]?.id) return

    try {
      await notifee.createChannel(CHANNELS[channel])
    } catch (error) {
      console.error('Error creating channel:', error)
    }
  }
}

export default new NotificationService()
