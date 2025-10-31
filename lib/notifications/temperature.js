// import notifee, { TriggerType } from '@notifee/react-native'
import { CHANNELS } from './channel'
import { tempReminderObservable } from '../../local-storage'
import {
  cancelNotifications,
  createChannel,
  TEMPERATURE_CHANNEL,
} from './channel'
import i18n from '../../i18n/i18n'
import { Colors } from '../../styles'
import { sendBaseNotification } from './utils'
import { RepeatFrequency } from '@notifee/react-native'

const notificationValue = {
  title: i18n.t('sideMenu.settings.reminders.temperatureReminder.title'),
  body: i18n.t('sideMenu.settings.reminders.temperatureReminder.notification'),
  android: {
    channelId: CHANNELS.TEMPERATURE.id,
    smallIcon: 'ic_notification',
    color: Colors.purple,
  },
  data: {
    screen: 'TemperatureEditView',
  },
}

function getReminderTimestamp(time) {
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

export async function setupTemperatureNotifications() {
  await createChannel(TEMPERATURE_CHANNEL)

  tempReminderObservable(async (reminder) => {
    await cancelNotifications(TEMPERATURE_CHANNEL)

    if (!reminder.enabled) return
    // for debugging purpose
    // const timestamp = Date.now() + 5 * 1000 // 5 seconds in milliseconds

    const timestamp = getReminderTimestamp(reminder.time)

    await sendBaseNotification(
      notificationValue,
      timestamp,
      RepeatFrequency.DAILY
    )
  }, false)
}
