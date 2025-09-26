import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native'
import { CHANNELS } from './setup'
import { tempReminderObservable } from '../../local-storage'

import i18n from '../../i18n/i18n'

async function sendNotification(trigger) {
  const notificationValue = {
    title: 'Meeting with Jane', // need to add translation title
    body: i18n.t(
      'sideMenu.settings.reminders.temperatureReminder.notification'
    ),
    android: {
      channelId: CHANNELS.TEMPERATURE.id,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
      },
    },
    data: {
      screen: 'TemperatureEditView',
    },
  }

  try {
    await notifee.createTriggerNotification(notificationValue, trigger)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

async function cancelTemperatureNotifications() {
  try {
    await notifee.cancelNotification(CHANNELS.TEMPERATURE.id)
  } catch (error) {
    console.error('Error canceling notifications:', error)
  }
}

function getReminderTimestamp(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  const now = new Date()
  const reminderDate = new Date()

  reminderDate.setHours(hours, minutes, 0, 0)

  // If time has already passed today, schedule for tomorrow
  if (reminderDate <= now) {
    reminderDate.setDate(reminderDate.getDate() + 1)
  }

  return reminderDate.getTime()
}

export default async function setupTemperatureNotifications() {
  tempReminderObservable(async (reminder) => {
    await cancelTemperatureNotifications()

    if (!reminder.enabled) return
    // // for deubgging purpose
    const timestamp = Date.now() + 5 * 1000 // 30 seconds in milliseconds

    // const timestamp = getReminderTimestamp(reminder.time);

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
    }

    await sendNotification(trigger)
  })
}
