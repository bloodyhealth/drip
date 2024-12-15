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
  const [isPeriodPredictionEnabled, setPeriodPrediction] = useState(
    periodPredictionObservable.value
  )

  const periodPredictionText = t(isPeriodPredictionEnabled ? 'on' : 'off')

  const onPeriodPredictionToggle = (value) => {
    setPeriodPrediction(value)
    savePeriodPrediction(value)
  }

  return (
    <Segment title={t('title')}>
      <AppSwitch
        onToggle={onPeriodPredictionToggle}
        text={periodPredictionText}
        value={isPeriodPredictionEnabled}
      />
    </Segment>
  )
}
