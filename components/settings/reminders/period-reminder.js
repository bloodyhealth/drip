import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AppSwitch from '../../common/app-switch'
import AdvanceNoticeDaysSlider from '../customization/advance-notice-days-slider'

import {
  periodReminderObservable,
  savePeriodReminder,
  periodPredictionObservable,
  saveAdvanceNoticeDays,
  advanceNoticeDaysObservable,
} from '../../../local-storage'

const PeriodReminder = () => {
  const isPeriodPredictionDisabled = !periodPredictionObservable.value

  const [isPeriodReminderEnabled, setIsPeriodReminderEnabled] = useState(
    periodReminderObservable.value.enabled
  )

  const [advanceNoticeDays, setAdvanceNoticeDays] = useState(
    advanceNoticeDaysObservable.value
  )

  const periodReminderToggle = (isEnabled) => {
    setIsPeriodReminderEnabled(isEnabled)
    savePeriodReminder({ enabled: isEnabled })
  }

  const handleAdvanceNoticeDaysChange = (days) => {
    setAdvanceNoticeDays(days)
    saveAdvanceNoticeDays(days)
  }

  const { t } = useTranslation(null, {
    keyPrefix: 'hamburgerMenu.settings.reminders.periodReminder',
  })

  const reminderText =
    advanceNoticeDays == 1
      ? t('reminderTextSingular')
      : t('reminderTextPlural', { days: advanceNoticeDays })

  return (
    <>
      <AppSwitch
        onToggle={periodReminderToggle}
        text={reminderText}
        value={isPeriodReminderEnabled}
        disabled={isPeriodPredictionDisabled}
      />
      {isPeriodReminderEnabled && (
        <AdvanceNoticeDaysSlider
          disabled={isPeriodPredictionDisabled}
          advanceNoticeDays={parseInt(advanceNoticeDays)}
          onAdvanceNoticeDaysChange={handleAdvanceNoticeDaysChange}
        />
      )}
    </>
  )
}

export default PeriodReminder
