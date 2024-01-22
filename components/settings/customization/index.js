import React, { useState } from 'react'

import AppPage from '../../common/app-page'
import AppSwitch from '../../common/app-switch'
import AppText from '../../common/app-text'
import TemperatureSlider from './temperature-slider'
import Segment from '../../common/segment'

import {
  allTrackingCategoryObservables,
  saveTrackingCategory,
  periodPredictionObservable,
  useCervixObservable,
} from '../../../local-storage'
import { Colors } from '../../../styles'
import labels from '../../../i18n/en/settings'

const Settings = () => {
  const [shouldUseCervix, setShouldUseCervix] = useState(
    useCervixObservable.value
  )

  const [isPeriodPredictionEnabled, setPeriodPrediction] = useState(
    periodPredictionObservable.value
  )

  const [isTrackingCategoryEnabled, setTrackingCategory] = useState(
    allTrackingCategoryObservables[symptom].value
  )

  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const trackingCategoryToggle = (symptom, value) => {
    setTrackingCategory(symptom, value)
    saveTrackingCategory(symptom, value)
  }

  const onPeriodPredictionToggle = (value) => {
    setPeriodPrediction(value)
    savePeriodPrediction(value)
  }

  const periodPredictionText = isPeriodPredictionEnabled
    ? labels.periodPrediction.on
    : labels.periodPrediction.off

  const onCervixToggle = (value) => {
    setShouldUseCervix(value)
    saveUseCervix(value)
  }

  const cervixText = shouldUseCervix
    ? labels.useCervix.cervixModeOn
    : labels.useCervix.cervixModeOff

  return (
    <AppPage title={'Customization'}>
      {/* for each symptom create a toggle switch */}
      <Segment title={'Tracking categories'}>
        {allTrackingCategoryObservables.map((symptom) => {
          const trackingToggle = trackingCategoryToggle(symptom)
          const isEnabled = allTrackingCategoryObservables[symptom].value

          return (
            <AppSwitch
              onToggle={trackingToggle}
              text={symptom}
              value={isEnabled}
              trackColor={{ true: Colors.turquoiseDark }}
            />
          )
        })}
      </Segment>

      <Segment title={'Fertility feature'}>
        <AppSwitch
          onToggle={toggleSwitch}
          text={'If turned on ...'}
          value={isEnabled}
          trackColor={{ true: Colors.turquoiseDark }}
        />
      </Segment>

      <Segment title={labels.tempScale.segmentTitle}>
        <AppText>{labels.tempScale.segmentExplainer}</AppText>
        <TemperatureSlider />
      </Segment>

      <Segment title={labels.useCervix.title}>
        <AppSwitch
          onToggle={onCervixToggle}
          text={cervixText}
          value={shouldUseCervix}
          trackColor={{ true: Colors.turquoiseDark }}
        />
      </Segment>

      <Segment title={labels.periodPrediction.title} last>
        <AppSwitch
          onToggle={onPeriodPredictionToggle}
          text={periodPredictionText}
          value={isPeriodPredictionEnabled}
          trackColor={{ true: Colors.turquoiseDark }}
        />
      </Segment>
    </AppPage>
  )
}

export default Settings
