import notifee, { TriggerType } from '@notifee/react-native'
import { setupPeriodNotifications } from './period'
import { setupTemperatureNotifications } from './temperature'
import { CHANNELS } from './constants'

export class NotificationService {
  isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    this.isInitialized = true
    await notifee.requestPermission()
    await setupPeriodNotifications()
    await setupTemperatureNotifications()
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
      console.error('Error sending base notification:', error)
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
