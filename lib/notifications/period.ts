import { AndroidImportance } from 'react-native-notify-kit'
import moment from 'moment'
import i18n from '../../i18n/i18n'
import {
  advanceNoticeDaysObservable,
  periodPredictionObservable,
  periodReminderObservable,
} from '../../local-storage'
import cycleModule from '../cycle'
import {
  cancelReminder,
  ReminderContent,
  scheduleReminder,
} from './notifications'

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
  periodPredictionObservable.value && periodReminderObservable.value.enabled

export const updatePeriodReminder = async (): Promise<void> => {
  await cancelReminder('period')
  if (!isReminderEnabled()) return

  const predictions: string[][] = cycleModule().getPredictedMenses()
  const [nextPrediction] = predictions
  if (!nextPrediction) return

  const advanceNoticeDays: number = advanceNoticeDaysObservable.value
  const reminderDate = moment(nextPrediction[0], 'YYYY-MM-DD')
    .subtract(advanceNoticeDays, 'days')
    .hours(REMINDER_HOUR)
  if (!reminderDate.isAfter()) return

  await scheduleReminder(
    'period',
    getContent(advanceNoticeDays, nextPrediction.length),
    reminderDate.valueOf()
  )
}
