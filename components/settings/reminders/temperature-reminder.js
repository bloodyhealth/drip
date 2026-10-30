import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Platform } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'

import AppSwitch from '../../common/app-switch'

import {
  saveTempReminder,
  tempReminderObservable,
  temperatureTrackingCategoryObservable,
} from '../../../local-storage'
import padWithZeros from '../../helpers/pad-time-with-zeros'

import { useTranslation } from 'react-i18next'

const TemperatureReminder = ({ requestPermission }) => {
  const { t } = useTranslation(null, {
    keyPrefix: 'sideMenu.settings.reminders.temperatureReminder',
  })
  const [isEnabled, setIsEnabled] = useState(
    tempReminderObservable.value.enabled
  )
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)
  const [time, setTime] = useState(tempReminderObservable.value.time)

  const temperatureReminderToggle = async (value) => {
    if (value) {
      if (!(await requestPermission())) return
      setIsTimePickerVisible(true)
    } else {
      saveTempReminder({ enabled: false })
      setIsEnabled(false)
    }
  }

  const onPickDate = (date) => {
    const time = padWithZeros(date)
    setIsEnabled(true)
    setIsTimePickerVisible(false)
    setTime(time)
    saveTempReminder({ time, enabled: true })
  }

  const onPickDateCancel = () => {
    setIsTimePickerVisible(false)
  }

  const tempReminderText =
    time && isEnabled ? t('timeSet', { time }) : t('noTimeSet')

  return (
    <>
      <AppSwitch
        onToggle={temperatureReminderToggle}
        text={tempReminderText}
        value={isEnabled}
        disabled={!temperatureTrackingCategoryObservable.value}
      />
      <DateTimePicker
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={onPickDate}
        onCancel={onPickDateCancel}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </>
  )
}

TemperatureReminder.propTypes = {
  requestPermission: PropTypes.func.isRequired,
}

export default TemperatureReminder
