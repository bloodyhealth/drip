import React from 'react'

import AppPage from '../../common/app-page'
import Segment from '../../common/segment'
import TemperatureReminder from './temperature-reminder'
import PeriodReminder from './period-reminder'

import {
  periodPredictionObservable,
  temperatureTrackingCategoryObservable,
} from '../../../local-storage'

import labels from '../../../i18n/en/settings'
import { Alert, Pressable } from 'react-native'

const Reminders = () => {
  const periodReminderDisabledPrompt = () => {
    if (!periodPredictionObservable.value) {
      Alert.alert(
        labels.periodReminder.alertNoPeriodReminder.title,
        labels.periodReminder.alertNoPeriodReminder.message
      )
    }
  }

  const tempReminderDisabledPrompt = () => {
    if (!temperatureTrackingCategoryObservable.value) {
      Alert.alert(
        labels.tempReminder.alertNoTempReminder.title,
        labels.tempReminder.alertNoTempReminder.message
      )
    }
  }

  return (
    <AppPage>
      <Pressable onPress={periodReminderDisabledPrompt}>
        <Segment title={labels.periodReminder.title}>
          <PeriodReminder />
        </Segment>
      </Pressable>
      <Pressable onPress={tempReminderDisabledPrompt}>
        <Segment title={labels.tempReminder.title} last>
          <TemperatureReminder />
        </Segment>
      </Pressable>
    </AppPage>
  )
}

export default Reminders
