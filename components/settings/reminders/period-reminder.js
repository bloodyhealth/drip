import React, { useState } from 'react'
import AppSwitch from '../../common/app-switch'
import AdvanceNoticeDaysSlider from '../customization/advance-notice-days-slider'

import {
  periodReminderObservable,
  savePeriodReminder,
  periodPredictionObservable,
  saveAdvanceNoticeDays,
  advanceNoticeDaysObservable,
} from '../../../local-storage'
import labels from '../../../i18n/en/settings'

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

  const reminderText =
    advanceNoticeDays == 1
      ? labels.periodReminder.reminderTextSingular
      : labels.periodReminder.reminderTextPlural(advanceNoticeDays)

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
