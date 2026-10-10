import React, { useState } from 'react'
import PropTypes from 'prop-types'
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

const PeriodReminder = ({ requestPermission }) => {
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
    if (isEnabled && !(await requestPermission())) return

    setIsPeriodReminderEnabled(isEnabled)
    savePeriodReminder({ enabled: isEnabled })
  }

  const handleAdvanceNoticeDaysChange = ([days]) => {
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
          advanceNoticeDays={advanceNoticeDays}
          onAdvanceNoticeDaysChange={handleAdvanceNoticeDaysChange}
        />
      )}
    </>
  )
}

PeriodReminder.propTypes = {
  requestPermission: PropTypes.func.isRequired,
}

export default PeriodReminder
