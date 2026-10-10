import { AndroidImportance, RepeatFrequency } from 'react-native-notify-kit'
import moment from 'moment'
import i18n from '../../i18n/i18n'
import {
  cancelReminder,
  ReminderContent,
  scheduleReminder,
} from './notifications'
import { TemperatureReminder } from './types'

const getContent = (): ReminderContent => ({
  title: i18n.t('sideMenu.settings.reminders.temperatureReminder.title'),
  body: i18n.t('sideMenu.settings.reminders.temperatureReminder.notification'),
  channelName: i18n.t('notifications.temperature.channelName'),
  importance: AndroidImportance.HIGH,
})

const getNextTimestamp = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  const reminderDate = moment().hours(hours).minutes(minutes).seconds(0)

  if (reminderDate.isBefore(moment())) reminderDate.add(1, 'd')

  return reminderDate.valueOf()
}

export const updateTemperatureReminder = async (
  reminder: TemperatureReminder
): Promise<void> => {
  await cancelReminder('temperature')
  if (!reminder.enabled) return

  await scheduleReminder(
    'temperature',
    getContent(),
    getNextTimestamp(reminder.time),
    RepeatFrequency.DAILY
  )
}
