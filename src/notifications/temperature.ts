import { LocalDate, ZonedDateTime, ZoneId } from '@js-joda/core'
import { AndroidImportance, RepeatFrequency } from 'react-native-notify-kit'
import i18n from '@/i18n/i18n'
import {
  cancelReminder,
  ReminderContent,
  scheduleReminder,
} from './notifications'
import { TemperatureReminder } from '@/notifications/types'

const getContent = (): ReminderContent => ({
  title: i18n.t('sideMenu.settings.reminders.temperatureReminder.title'),
  body: i18n.t('sideMenu.settings.reminders.temperatureReminder.notification'),
  channelName: i18n.t('notifications.temperature.channelName'),
  importance: AndroidImportance.HIGH,
})

const getNextTimestamp = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  const today = LocalDate.now()
    .atTime(hours, minutes)
    .atZone(ZoneId.systemDefault())
  const reminderDate = today.isBefore(ZonedDateTime.now())
    ? today.plusDays(1)
    : today
  return reminderDate.toInstant().toEpochMilli()
}

export const updateTemperatureReminder = async (
  reminder: TemperatureReminder | undefined
): Promise<void> => {
  await cancelReminder('temperature')
  if (!reminder?.enabled) return

  await scheduleReminder(
    'temperature',
    getContent(),
    getNextTimestamp(reminder.time),
    RepeatFrequency.DAILY
  )
}
