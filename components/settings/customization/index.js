import React, { useState } from 'react'
import { Alert, Pressable } from 'react-native'

import AppPage from '../../common/app-page'
import AppSwitch from '../../common/app-switch'
import AppText from '../../common/app-text'
import TemperatureSlider from './temperature-slider'
import Segment from '../../common/segment'

import {
  desireTrackingCategoryObservable,
  moodTrackingCategoryObservable,
  noteTrackingCategoryObservable,
  painTrackingCategoryObservable,
  sexTrackingCategoryObservable,
  temperatureTrackingCategoryObservable,
  saveDesireTrackingCategory,
  saveMoodTrackingCategory,
  saveNoteTrackingCategory,
  savePainTrackingCategory,
  savePeriodPrediction,
  saveSexTrackingCategory,
  saveTemperatureTrackingCategory,
  saveUseCervix,
  periodPredictionObservable,
  useCervixObservable,
} from '../../../local-storage'
import labels from '../../../i18n/en/settings'
import { SYMPTOMS } from '../../../config'

const Settings = () => {
  const [shouldUseCervix, setShouldUseCervix] = useState(
    useCervixObservable.value
  )

  const [isPeriodPredictionEnabled, setPeriodPrediction] = useState(
    periodPredictionObservable.value
  )

  const [isTemperatureTrackingCategoryEnabled, setTemperatureTrackingCategory] =
    useState(temperatureTrackingCategoryObservable.value)

  const [isSexTrackingCategoryEnabled, setSexTrackingCategory] = useState(
    sexTrackingCategoryObservable.value
  )

  const [isDesireTrackingCategoryEnabled, setDesireTrackingCategory] = useState(
    desireTrackingCategoryObservable.value
  )

  const [isPainTrackingCategoryEnabled, setPainTrackingCategory] = useState(
    painTrackingCategoryObservable.value
  )

  const [isMoodTrackingCategoryEnabled, setMoodTrackingCategory] = useState(
    moodTrackingCategoryObservable.value
  )

  const [isNoteTrackingCategoryEnabled, setNoteTrackingCategory] = useState(
    noteTrackingCategoryObservable.value
  )

  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const temperatureTrackingCategoryToggle = (value) => {
    setTemperatureTrackingCategory(value)
    saveTemperatureTrackingCategory(value)
  }

  const sexTrackingCategoryToggle = (value) => {
    setSexTrackingCategory(value)
    saveSexTrackingCategory(value)
  }

  const desireTrackingCategoryToggle = (value) => {
    setDesireTrackingCategory(value)
    saveDesireTrackingCategory(value)
  }
  const painTrackingCategoryToggle = (value) => {
    setPainTrackingCategory(value)
    savePainTrackingCategory(value)
  }
  const moodTrackingCategoryToggle = (value) => {
    setMoodTrackingCategory(value)
    saveMoodTrackingCategory(value)
  }
  const noteTrackingCategoryToggle = (value) => {
    setNoteTrackingCategory(value)
    saveNoteTrackingCategory(value)
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

  const sliderDisabledPrompt = () => {
    if (!isTemperatureTrackingCategoryEnabled) {
      Alert.alert(labels.disabled.title, labels.disabled.message)
    }
  }
  return (
    <AppPage title={'Customization'}>
      <Segment title={'Tracking categories'}>
        <AppSwitch
          onToggle={temperatureTrackingCategoryToggle}
          text={SYMPTOMS[1]}
          value={isTemperatureTrackingCategoryEnabled}
        />
        <AppSwitch
          onToggle={sexTrackingCategoryToggle}
          text={SYMPTOMS[4]}
          value={isSexTrackingCategoryEnabled}
        />
        <AppSwitch
          onToggle={desireTrackingCategoryToggle}
          text={SYMPTOMS[5]}
          value={isDesireTrackingCategoryEnabled}
        />
        <AppSwitch
          onToggle={painTrackingCategoryToggle}
          text={SYMPTOMS[6]}
          value={isPainTrackingCategoryEnabled}
        />
        <AppSwitch
          onToggle={moodTrackingCategoryToggle}
          text={SYMPTOMS[7]}
          value={isMoodTrackingCategoryEnabled}
        />
        <AppSwitch
          onToggle={noteTrackingCategoryToggle}
          text={SYMPTOMS[8]}
          value={isNoteTrackingCategoryEnabled}
        />
      </Segment>

      <Segment title={'Fertility feature'}>
        <AppSwitch
          onToggle={toggleSwitch}
          text={'If turned on ...'}
          value={isEnabled}
        />
      </Segment>

      <Pressable onPress={sliderDisabledPrompt}>
        <Segment title={labels.tempScale.segmentTitle}>
          {isTemperatureTrackingCategoryEnabled && (
            <>
              <AppText>{labels.tempScale.segmentExplainer}</AppText>
              <TemperatureSlider />
            </>
          )}
          {!isTemperatureTrackingCategoryEnabled && (
            <AppText>{labels.disabled.message}</AppText>
          )}
        </Segment>
      </Pressable>

      <Pressable onPress={sliderDisabledPrompt}>
        <Segment title={labels.useCervix.title}>
          {isTemperatureTrackingCategoryEnabled && (
            <AppSwitch
              onToggle={onCervixToggle}
              text={cervixText}
              value={shouldUseCervix}
            />
          )}
          {!isTemperatureTrackingCategoryEnabled && (
            <AppText>{labels.disabled.message}</AppText>
          )}
        </Segment>
      </Pressable>

      <Segment title={labels.periodPrediction.title} last>
        <AppSwitch
          onToggle={onPeriodPredictionToggle}
          text={periodPredictionText}
          value={isPeriodPredictionEnabled}
        />
      </Segment>
    </AppPage>
  )
}

export default Settings
