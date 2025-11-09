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
import AndroidBackgroundRestrictions from '../../../lib/notifications/android-background-restrictions'

const PeriodReminder = () => {
  const { t } = useTranslation(null, {
    keyPrefix: 'sideMenu.settings.reminders.periodReminder',
  })

  const isPeriodPredictionEnabled = periodPredictionObservable.value

  const [isPeriodReminderEnabled, setIsPeriodReminderEnabled] = useState(
    periodReminderObservable.value.enabled
  )

  const [advanceNoticeDays, setAdvanceNoticeDays] = useState(
    advanceNoticeDaysObservable.value
  )

  const periodReminderToggle = async (isEnabled) => {
    setIsPeriodReminderEnabled(isEnabled)
    savePeriodReminder({ enabled: isEnabled })

    // Check Android background restrictions when enabling reminder
    if (isEnabled) {
      await AndroidBackgroundRestrictions.checkAllRestrictions()
    }
  }

  const handleAdvanceNoticeDaysChange = (days) => {
    setAdvanceNoticeDays(days)
    saveAdvanceNoticeDays(days)
  }

  const isReminderEnabled = isPeriodPredictionEnabled && isPeriodReminderEnabled

  const reminderText = isReminderEnabled
    ? t('reminderText', { count: advanceNoticeDays })
    : t('reminderTextDisabled')

  return (
    <>
      <AppSwitch
        onToggle={periodReminderToggle}
        text={reminderText}
        value={isReminderEnabled}
        disabled={!isPeriodPredictionEnabled}
      />
      {isReminderEnabled && (
        <AdvanceNoticeDaysSlider
          advanceNoticeDays={parseInt(advanceNoticeDays)}
          onAdvanceNoticeDaysChange={handleAdvanceNoticeDaysChange}
        />
      )}
    </>
  )
}

export default PeriodReminder
