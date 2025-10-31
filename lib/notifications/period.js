import {
  advanceNoticeDaysObservable,
  periodReminderObservable,
} from '../../local-storage'
import cycleModule from '../cycle'
import i18n from '../../i18n/i18n'
import { Colors } from '../../styles'
import Moment from 'moment'
import NotificationService from './notification-service'
import { CHANNELS, PERIOD_CHANNEL } from './constants'

let unsubscribePeriodReminder = null

function getNotificationValue(advanceNoticeDays, daysToEndOfPrediction) {
  return {
    title: i18n.t('sideMenu.settings.reminders.periodReminder.title'),
    body: i18n.t('notification', {
      advanceNoticeDays,
      daysToEndOfPrediction,
    }),
    android: {
      channelId: CHANNELS.PERIOD.id,
      smallIcon: 'ic_notification',
      color: Colors.purple,
    },
    data: {
      screen: 'Home',
    },
  }
}

export async function setupPeriodNotifications() {
  await NotificationService.createChannel(PERIOD_CHANNEL)

  // Unsubscribe from previous subscription if it exists
  if (unsubscribePeriodReminder) {
    unsubscribePeriodReminder()
    unsubscribePeriodReminder = null
  }

  // Store the unsubscribe function returned by the observable
  unsubscribePeriodReminder = periodReminderObservable(async (reminder) => {
    await NotificationService.cancelNotifications(PERIOD_CHANNEL)

    if (!reminder.enabled) return

    const bleedingPrediction = cycleModule().getPredictedMenses()

    if (bleedingPrediction.length > 0) {
      const predictedBleedingStart = Moment(
        bleedingPrediction[0][0],
        'YYYY-MM-DD'
      )

      const advanceNoticeDays = parseInt(advanceNoticeDaysObservable.value)

      // ${advanceNoticeDays} days before and at 6 am
      const reminderDate = predictedBleedingStart
        .subtract(advanceNoticeDays, 'days')
        .hours(6)
        .minutes(0)
        .seconds(0)

      if (reminderDate.isAfter()) {
        const daysToEndOfPrediction =
          advanceNoticeDays + bleedingPrediction[0].length - 1

        const notificationValue = getNotificationValue(
          advanceNoticeDays,
          daysToEndOfPrediction
        )

        const timestamp = reminderDate.toDate().getTime()

        await NotificationService.scheduleNotification(
          notificationValue,
          timestamp
        )
      }
    }
  }, false)
}
