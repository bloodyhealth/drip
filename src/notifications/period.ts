import { LocalDate, ZonedDateTime, ZoneId } from '@js-joda/core'
import { AndroidImportance } from 'react-native-notify-kit'
import i18n from '@/i18n/i18n'
import {
  advanceNoticeDaysObservable,
  periodPredictionObservable,
  periodReminderObservable,
} from '@/local-storage'
import cycleModule from '@/lib/cycle'
import {
  cancelReminder,
  ReminderContent,
  scheduleReminder,
} from '@/notifications/notifications'

const REMINDER_HOUR = 6

const getContent = (
  advanceNoticeDays: number,
  predictedDays: number
): ReminderContent => ({
  title: i18n.t('sideMenu.settings.reminders.periodReminder.title'),
  body: i18n.t('sideMenu.settings.reminders.periodReminder.notification', {
    advanceNoticeDays,
    daysToEndOfPrediction: advanceNoticeDays + predictedDays - 1,
  }),
  channelName: i18n.t('notifications.period.channelName'),
  importance: AndroidImportance.DEFAULT,
})

const isReminderEnabled = (): boolean =>
  periodPredictionObservable.value && periodReminderObservable.value?.enabled

export const updatePeriodReminder = async (): Promise<void> => {
  await cancelReminder('period')
  if (!isReminderEnabled()) return

  const predictions: string[][] = cycleModule().getPredictedMenses()
  const [nextPrediction] = predictions
  if (!nextPrediction) return

  const advanceNoticeDays: number = advanceNoticeDaysObservable.value
  const reminderDate = LocalDate.parse(nextPrediction[0])
    .minusDays(advanceNoticeDays)
    .atTime(REMINDER_HOUR, 0)
    .atZone(ZoneId.systemDefault())
  if (!reminderDate.isAfter(ZonedDateTime.now())) return

  await scheduleReminder(
    'period',
    getContent(advanceNoticeDays, nextPrediction.length),
    reminderDate.toInstant().toEpochMilli()
  )
}
