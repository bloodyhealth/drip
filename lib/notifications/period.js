import {
  advanceNoticeDaysObservable,
  periodReminderObservable,
} from '../../local-storage'
import cycleModule from '../cycle'
import i18n from '../../i18n/i18n'
import NotificationService from './notification-service'
import { CHANNELS, NOTIFICATION_TYPE } from './constants'
import { getBleedingDaysSortedByDate } from '../../db'
import nothingChanged from '../../db/db-unchanged'
import moment from 'moment'

function getNotificationConfig(advanceNoticeDays, daysToEndOfPrediction) {
  return {
    title: i18n.t('sideMenu.settings.reminders.periodReminder.title'),
    body: i18n.t('notification', {
      advanceNoticeDays,
      daysToEndOfPrediction,
    }),
    android: {
      channelId: CHANNELS.PERIOD.id,
    },
    data: {
      screen: 'Home',
      notificationType: NOTIFICATION_TYPE.PERIOD,
    },
  }
}

export async function setupPeriodNotifications() {
  await NotificationService.createChannel(NOTIFICATION_TYPE.PERIOD)

  periodReminderObservable(setupNotification, false)
  advanceNoticeDaysObservable(setupNotification, false)
  getBleedingDaysSortedByDate().addListener((_, changes) => {
    // the listener fires on setup, so we check if there were actually any changes
    if (nothingChanged(changes)) {
      return
    }

    setupNotification()
  })
}

async function setupNotification() {
  await NotificationService.cancelNotifications(NOTIFICATION_TYPE.PERIOD)

  if (!periodReminderObservable.value.enabled) return

  const bleedingPrediction = cycleModule().getPredictedMenses()

  if (!bleedingPrediction.length) {
    return
  }

  bleedingPrediction.forEach(scheduleNotificationForPrediction)
}

/**
 * Schedules a notification for a predicted bleeding period.
 *
 * @param {string[]} bleedingPrediction - An array of date strings in 'YYYY-MM-DD' format
 *   Example: ["2025-11-01", "2025-11-02", "2025-11-03"]
 *   The first date (bleedingPrediction[0]) is used as the predicted start date.
 *   The array length is used to calculate the total duration of the predicted period.
 */
async function scheduleNotificationForPrediction(bleedingPrediction) {
  const predictedBleedingStart = moment(
    bleedingPrediction[0],
    'YYYY-MM-DD'
  ).startOf('day')

  const advanceNoticeDays = parseInt(advanceNoticeDaysObservable.value)

  // ${advanceNoticeDays} days before and at 6 am
  const reminderDate = predictedBleedingStart
    .subtract(advanceNoticeDays, 'days')
    .hours(6)
    .minutes(0)
    .seconds(0)

  const isInFuture = reminderDate.isAfter()

  if (!isInFuture) {
    return
  }

  const daysToEndOfPrediction =
    advanceNoticeDays + bleedingPrediction.length - 1

  const notificationConfig = getNotificationConfig(
    advanceNoticeDays,
    daysToEndOfPrediction
  )

  const timestamp = reminderDate.toDate().getTime()

  await NotificationService.scheduleNotification(notificationConfig, timestamp)
}
