import { tempReminderObservable } from '../../local-storage'
import i18n from '../../i18n/i18n'
import { Colors } from '../../styles'
import { RepeatFrequency } from '@notifee/react-native'
import NotificationService from './notification-service'
import { CHANNELS, TEMPERATURE_CHANNEL } from './constants'

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

export async function setupTemperatureNotifications() {
  await NotificationService.createChannel(TEMPERATURE_CHANNEL)

  tempReminderObservable(async (reminder) => {
    await NotificationService.cancelNotifications(TEMPERATURE_CHANNEL)

    if (!reminder.enabled) return

    const timestamp = getReminderTimestamp(reminder.time)

    await NotificationService.scheduleNotification(
      notificationValue,
      timestamp,
      RepeatFrequency.DAILY
    )
  }, false)
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
