import { tempReminderObservable } from '../../local-storage'
import i18n from '../../i18n/i18n'
import { RepeatFrequency } from '@notifee/react-native'
import NotificationService from './notification-service'
import { CHANNELS, NOTIFICATION_TYPE } from './constants'
import moment from 'moment'

const notificationConfig = {
  title: i18n.t('sideMenu.settings.reminders.temperatureReminder.title'),
  body: i18n.t('sideMenu.settings.reminders.temperatureReminder.notification'),
  android: {
    channelId: CHANNELS.TEMPERATURE.id,
  },
  data: {
    screen: 'TemperatureEditView',
    notificationType: NOTIFICATION_TYPE.TEMPERATURE,
  },
}

export async function setupTemperatureNotifications() {
  await NotificationService.createChannel(NOTIFICATION_TYPE.TEMPERATURE)

  tempReminderObservable(async (reminder) => {
    await NotificationService.cancelNotifications(NOTIFICATION_TYPE.TEMPERATURE)

    if (!reminder.enabled) return

    const timestamp = getReminderTimestamp(reminder.time)

    await NotificationService.scheduleNotification(
      notificationConfig,
      timestamp,
      RepeatFrequency.DAILY
    )
  }, false)
}

function getReminderTimestamp(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const reminderDate = moment().hours(hours).minutes(minutes).seconds(0)

  if (reminderDate.isBefore(moment())) {
    return reminderDate.add(1, 'd').valueOf()
  }

  return reminderDate.valueOf()
}
