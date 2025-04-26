import { Platform } from 'react-native'
import {
  tempReminderObservable,
  periodReminderObservable,
  advanceNoticeDaysObservable,
} from '../local-storage'
import * as PN from 'react-native-push-notification'
import { requestNotifications } from 'react-native-permissions'
import Moment from 'moment'
import { useTranslation } from 'react-i18next'
import { LocalDate } from '@js-joda/core'

import { getBleedingDaysSortedByDate } from '../db'
import cycleModule from './cycle'
import nothingChanged from '../db/db-unchanged'
import i18n from '../i18n/i18n'

const DRIP_CHANNEL_ID = 'drip-channel-id'
const TEMPERATURE_REMINDER_ID = '1'
const PERIOD_REMINDER_ID = '2'
const PushNotification = Platform.OS === 'ios' ? PN : PN.default

export default function setupNotifications(navigate, setDate) {
  // for Android, this method call is necessary
  if (Platform.OS === 'android') {
    requestNotifications()
  }

  PushNotification.createChannel({
    channelId: DRIP_CHANNEL_ID, // (required)
    channelName: 'drip reminder', // (required)
    playSound: false, // (optional) default: true
  })

  PushNotification.configure({
    onNotification: (notification) => {
      // https://github.com/zo0r/react-native-push-notification/issues/966#issuecomment-479069106
      if (
        notification.data?.id === TEMPERATURE_REMINDER_ID ||
        notification.id === TEMPERATURE_REMINDER_ID
      ) {
        const todayDate = LocalDate.now().toString()
        setDate(todayDate)
        navigate('TemperatureEditView')
      } else {
        navigate('Home')
      }
    },
  })

  tempReminderObservable((reminder) => {
    PushNotification.cancelLocalNotification({ id: TEMPERATURE_REMINDER_ID })
    if (reminder.enabled) {
      const [hours, minutes] = reminder.time.split(':')
      let target = new Moment()
        .hours(parseInt(hours))
        .minutes(parseInt(minutes))
        .seconds(0)

      if (target.isBefore(new Moment())) {
        target = target.add(1, 'd')
      }

      PushNotification.localNotificationSchedule({
        id: TEMPERATURE_REMINDER_ID,
        userInfo: { id: TEMPERATURE_REMINDER_ID },
        message: i18n.t(
          'sideMenu.settings.reminders.temperatureReminder.notification'
        ),
        date: target.toDate(),
        vibrate: false,
        repeatType: 'day',
        channelId: DRIP_CHANNEL_ID,
        allowWhileIdle: true,
      })
    }
  }, false)

  periodReminderObservable(() => updatePeriodNotification(), false)
  advanceNoticeDaysObservable(() => updatePeriodNotification(), false)

  getBleedingDaysSortedByDate().addListener((_, changes) => {
    // the listener fires on setup, so we check if there were actually any changes
    if (nothingChanged(changes)) {
      return
    }

    updatePeriodNotification()
  })
}

const updatePeriodNotification = () => {
  // Cancel any existing period reminder
  PushNotification.cancelLocalNotification({ id: PERIOD_REMINDER_ID })

  // Set up a new period reminder if enabled
  if (periodReminderObservable.value.enabled) {
    schedulePeriodNotification()
  }
}

function schedulePeriodNotification() {
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

    const { t } = useTranslation(null, {
      keyPrefix: 'sideMenu.settings.reminders.periodReminder',
    })

    if (reminderDate.isAfter()) {
      // period is likely to start in advanceNoticeDays to advanceNoticeDays + (length of prediction - 1) days
      const daysToEndOfPrediction =
        advanceNoticeDays + bleedingPrediction[0].length - 1

      PushNotification.localNotificationSchedule({
        id: PERIOD_REMINDER_ID,
        userInfo: { id: PERIOD_REMINDER_ID },
        message: t('notification', {
          advanceNoticeDays,
          daysToEndOfPrediction,
        }),
        date: reminderDate.toDate(),
        vibrate: false,
        channelId: DRIP_CHANNEL_ID,
        allowWhileIdle: true,
      })
    }
  }
}
