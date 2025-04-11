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

import { Alert, Pressable } from 'react-native'

const Reminders = () => {
  const { t } = useTranslation(null, {
    keyPrefix: 'hamburgerMenu.settings.reminders',
  })

  const periodReminderDisabledPrompt = () => {
    if (!periodPredictionObservable.value) {
      Alert.alert(
        t('periodReminder.alert.title'),
        t('periodReminder.alert.text')
      )
    }
  }

  const tempReminderDisabledPrompt = () => {
    if (!temperatureTrackingCategoryObservable.value) {
      Alert.alert(
        t('temperatureReminder.alert.title'),
        t('temperatureReminder.alert.text')
      )
    }
  }

  return (
    <AppPage>
      <Pressable onPress={periodReminderDisabledPrompt}>
        <Segment title={t('periodReminder.title')}>
          <PeriodReminder />
        </Segment>
      </Pressable>
      <Pressable onPress={tempReminderDisabledPrompt}>
        <Segment title={t('temperatureReminder.title')} last>
          <TemperatureReminder />
        </Segment>
      </Pressable>
    </AppPage>
  )
}

export default Reminders
