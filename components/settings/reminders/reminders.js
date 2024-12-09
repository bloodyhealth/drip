import React from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(null, {
    keyPrefix: 'hamburgerMenu.settings.reminders.periodReminder',
  })

  const periodReminderDisabledPrompt = () => {
    if (!periodPredictionObservable.value) {
      Alert.alert(
        t('alertNoPeriodReminder.title'),
        t('alertNoPeriodReminder.message')
      )
    }
  }

  const tempReminderDisabledPrompt = () => {
    if (!temperatureTrackingCategoryObservable.value) {
      Alert.alert(
        t('alertNoPeriodReminder.title'),
        t('alertNoPeriodReminder.message')
      )
    }
  }

  return (
    <AppPage>
      <Pressable onPress={periodReminderDisabledPrompt}>
        <Segment title={t('title')}>
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
