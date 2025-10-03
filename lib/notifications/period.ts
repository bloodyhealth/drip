import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native'
import { CHANNELS } from './channel'
import {
  periodReminderObservable,
  advanceNoticeDaysObservable,
} from '../../local-storage'
import cycleModule from '../cycle'
import { cancelNotifications, createChannel } from './channel'

async function sendNotification(trigger) {
  const notificationValue = {
    title: 'Period Prediction',
    body: 'Testing period notification',
    android: {
      channelId: CHANNELS.PERIOD.id,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
      },
    },
    data: {
      screen: 'Home',
    },
  }

  try {
    await notifee.createTriggerNotification(notificationValue, trigger)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

export async function setupPeriodNotifications() {
  await createChannel('PERIOD')

  periodReminderObservable(async (reminder) => {
    await cancelNotifications('PERIOD')

    if (!reminder.enabled) return

    const bleedingPrediction = cycleModule().getPredictedMenses()

    if (bleedingPrediction.length > 0) {
      const firstBleedingPrediction = bleedingPrediction[0][0]

      const date = new Date(firstBleedingPrediction)
      date.setDate(date.getDate() - advanceNoticeDaysObservable.value)

      const timestamp = date.getTime()
      const now = Date.now()

      if (timestamp <= now) return

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp,
      }

      await sendNotification(trigger)
    }
  })
}
