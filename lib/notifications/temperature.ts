import { tempReminderObservable } from '../../local-storage'
import i18n from '../../i18n/i18n'
import { AndroidImportance, RepeatFrequency } from '@notifee/react-native'
import NotificationService from './notification-service'
import moment from 'moment'
import { NotificationConfig, Reminder } from './types.ts'

let isSetup: boolean = false

export const notificationConfig: NotificationConfig = {
  id: 'temperature',
  title: i18n.t('sideMenu.settings.reminders.temperatureReminder.title'),
  body: i18n.t('sideMenu.settings.reminders.temperatureReminder.notification'),
  channel: {
    id: 'temperature',
    name: i18n.t('notifications.temperature.channelName'),
    importance: AndroidImportance.HIGH,
  },
  data: {
    screen: 'TemperatureEditView',
  },
}

export async function setupTemperatureNotifications() {
  if (isSetup) {
    return
  }
  isSetup = true
  tempReminderObservable(async (reminder: Reminder) => {
    await NotificationService.cancelNotification('temperature')

    if (!reminder.enabled) return

    const timestamp = getReminderTimestamp(reminder.time)

    await NotificationService.scheduleNotification(
      notificationConfig,
      timestamp,
      RepeatFrequency.DAILY
    )
  }, false)
}

function getReminderTimestamp(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  const reminderDate = moment().hours(hours).minutes(minutes).seconds(0)

  if (reminderDate.isBefore(moment())) {
    return reminderDate.add(1, 'd').valueOf()
  }

  return reminderDate.valueOf()
}
