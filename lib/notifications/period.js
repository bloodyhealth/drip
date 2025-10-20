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
      const firstBleedingPrediction = bleedingPrediction[0][0]

      const advanceNoticeDays = parseInt(advanceNoticeDaysObservable.value)
      const daysToEndOfPrediction =
        advanceNoticeDays + bleedingPrediction[0].length - 1

      const date = new Date(firstBleedingPrediction)
      date.setDate(date.getDate() - advanceNoticeDays)

      const timestamp = date.getTime()
      const now = Date.now()

      if (timestamp <= now) return

      const notificationValue = getNotificationValue(
        advanceNoticeDays,
        daysToEndOfPrediction
      )

      await sendBaseNotification(notificationValue, timestamp)
    }
  })
}
