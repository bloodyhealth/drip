import AppSwitch from '../../../common/app-switch'
import Segment from '../../../common/segment'
import React, { useState } from 'react'
import {
  periodPredictionObservable,
  savePeriodPrediction,
} from '../../../../local-storage'
import { useTranslation } from 'react-i18next'

export const PeriodPrediction = () => {
  const { t } = useTranslation(null, {
    keyPrefix: 'hamburgerMenu.settings.customization.periodPrediction',
  })
  const [isEnabled, setIsEnabled] = useState(periodPredictionObservable.value)

  const periodPredictionText = t(isEnabled ? 'on' : 'off')

  const onToggle = (value) => {
    setIsEnabled(value)
    savePeriodPrediction(value)
  }

  return (
    <Segment title={t('title')}>
      <AppSwitch
        onToggle={onToggle}
        text={periodPredictionText}
        value={isEnabled}
      />
    </Segment>
  )
}
