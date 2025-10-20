import {
  CHANNELS,
  cancelNotifications,
  createChannel,
  PERIOD_CHANNEL,
} from './channel'
import {
  periodReminderObservable,
  advanceNoticeDaysObservable,
} from '../../local-storage'
import cycleModule from '../cycle'
import i18n from '../../i18n/i18n'
import { Colors } from '../../styles'
import { sendBaseNotification } from './utils'
import Moment from 'moment'

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
  await createChannel(PERIOD_CHANNEL)

  periodReminderObservable(async (reminder) => {
    await cancelNotifications(PERIOD_CHANNEL)

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

        await sendBaseNotification(notificationValue, timestamp)
      }
    }
  }, false)
}
