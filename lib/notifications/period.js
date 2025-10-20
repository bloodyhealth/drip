import notifee, { TriggerType } from '@notifee/react-native'
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

async function sendNotification(
  trigger,
  advanceNoticeDays,
  daysToEndOfPrediction
) {
  const notificationValue = {
    title: i18n.t('sideMenu.settings.reminders.periodReminder.title'), // need to add translation title
    body: i18n.t('notification', {
      advanceNoticeDays,
      daysToEndOfPrediction,
    }),
    android: {
      channelId: CHANNELS.PERIOD.id,
    },
    data: {
      screen: 'Home',
    },
  }

  try {
    await notifee.createTriggerNotification(notificationValue, trigger)
  } catch (error) {
    console.error('Error sending period notification:', error)
  }
}

export async function setupPeriodNotifications() {
  await createChannel(PERIOD_CHANNEL)

  periodReminderObservable(async (reminder) => {
    await cancelNotifications(PERIOD_CHANNEL)

    if (!reminder.enabled) return

    const bleedingPrediction = cycleModule().getPredictedMenses()
    const advanceNoticeDays = parseInt(advanceNoticeDaysObservable.value)
    const daysToEndOfPrediction =
      advanceNoticeDays + bleedingPrediction[0].length - 1

    if (bleedingPrediction.length > 0) {
      const firstBleedingPrediction = bleedingPrediction[0][0]

      const date = new Date(firstBleedingPrediction)
      date.setDate(date.getDate() - advanceNoticeDays)

      const timestamp = date.getTime()
      const now = Date.now()

      if (timestamp <= now) return

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp,
      }

      await sendNotification(trigger, advanceNoticeDays, daysToEndOfPrediction)
    }
  })
}
