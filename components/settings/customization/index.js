import React, { useEffect, useState } from 'react'
import { Alert, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import AppPage from '../../common/app-page'
import AppSwitch from '../../common/app-switch'
import AppText from '../../common/app-text'
import TemperatureSlider from './temperature-slider'
import Segment from '../../common/segment'
import TrackingCategorySwitch from '../../common/tracking-category-switch'
import SelectTabGroup from '../../cycle-day/select-tab-group'

import {
  cervixTrackingCategoryObservable,
  desireTrackingCategoryObservable,
  fertilityTrackingObservable,
  moodTrackingCategoryObservable,
  mucusTrackingCategoryObservable,
  noteTrackingCategoryObservable,
  painTrackingCategoryObservable,
  saveCervixTrackingCategory,
  saveDesireTrackingCategory,
  saveFertilityTrackingEnabled,
  saveMoodTrackingCategory,
  saveMucusTrackingCategory,
  saveNoteTrackingCategory,
  savePainTrackingCategory,
  saveSexTrackingCategory,
  saveTemperatureTrackingCategory,
  saveUseCervixAsSecondarySymptom,
  sexTrackingCategoryObservable,
  temperatureTrackingCategoryObservable,
  useCervixAsSecondarySymptomObservable,
} from '../../../local-storage'
import labels from '../../../i18n/en/settings'
import { SYMPTOMS } from '../../../config'
import { InfertileDaysInfo } from './sections/InfertileDaysInfo'
import { PeriodPrediction } from './sections/period-prediction'

const Settings = () => {
  const { t } = useTranslation()

  const [useCervixAsSecondarySymptom, setUseCervixAsSecondarySymptom] =
    useState(useCervixAsSecondarySymptomObservable.value)

  const [isTemperatureTrackingCategoryEnabled, setTemperatureTrackingCategory] =
    useState(temperatureTrackingCategoryObservable.value)

  const [isMucusTrackingCategoryEnabled, setMucusTrackingCategory] = useState(
    mucusTrackingCategoryObservable.value
  )

  const [isCervixTrackingCategoryEnabled, setCervixTrackingCategory] = useState(
    cervixTrackingCategoryObservable.value
  )

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

  const [isFertilityTrackingEnabled, setFertilityTrackingEnabled] = useState(
    fertilityTrackingObservable.value
  )

  const fertilityTrackingToggle = (value) => {
    setFertilityTrackingEnabled(value)
    saveFertilityTrackingEnabled(value)
  }

  const temperatureTrackingCategoryToggle = (value) => {
    setTemperatureTrackingCategory(value)
    saveTemperatureTrackingCategory(value)
    if (!value) {
      setFertilityTrackingEnabled(false)
      saveFertilityTrackingEnabled(false)
    }
  }
  const mucusTrackingCategoryToggle = (value) => {
    manageSecondarySymptom(cervixTrackingCategoryObservable.value, value)
  }
  const cervixTrackingCategoryToggle = (value) => {
    manageSecondarySymptom(value, mucusTrackingCategoryObservable.value)
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

  const fertilityTrackingText = t(
    `hamburgerMenu.settings.customization.fertilityPhases.${
      isFertilityTrackingEnabled ? 'on' : 'off'
    }`
  )

  const secondarySymptomButtons = [
    {
      label: t('symptoms.mucus'),
      value: 0,
    },
    {
      label: t('symptoms.cervix'),
      value: 1,
    },
  ]

  const onSelectTab = (value) => {
    if (isMucusTrackingCategoryEnabled && isCervixTrackingCategoryEnabled) {
      setUseCervixAsSecondarySymptom(value)
      saveUseCervixAsSecondarySymptom(value)
    } else {
      secondarySymptomDisabledPrompt()
    }
  }

  // is needed so secondary symptom is set correct on load
  useEffect(() => {
    manageSecondarySymptom(
      cervixTrackingCategoryObservable.value,
      mucusTrackingCategoryObservable.value
    )
  }, [])

  const manageSecondarySymptom = (cervix, mucus) => {
    if (!cervix && mucus) {
      setUseCervixAsSecondarySymptom(0)
      saveUseCervixAsSecondarySymptom(0)
    } else if (cervix && !mucus) {
      setUseCervixAsSecondarySymptom(1)
      saveUseCervixAsSecondarySymptom(1)
    } else if (!cervix && !mucus) {
      setFertilityTrackingEnabled(false)
      saveFertilityTrackingEnabled(false)
    }
    setMucusTrackingCategory(mucus)
    saveMucusTrackingCategory(mucus)
    setCervixTrackingCategory(cervix)
    saveCervixTrackingCategory(cervix)
  }

  const secondarySymptomDisabledPrompt = () => {
    if (!isFertilityTrackingEnabled) {
      Alert.alert(
        t('hamburgerMenu.settings.customization.secondarySymptom.alert.title'),
        t(
          'hamburgerMenu.settings.customization.secondarySymptom.alert.textFertilityTrackingDisabled'
        )
      )
    } else if (
      !isMucusTrackingCategoryEnabled == isCervixTrackingCategoryEnabled
    ) {
      Alert.alert(
        t('hamburgerMenu.settings.customization.secondarySymptom.alert.title'),
        t(
          'hamburgerMenu.settings.customization.secondarySymptom.alert.textMissingSecondarySymptoms'
        )
      )
    }
  }

  const manageFertilityFeature =
    isTemperatureTrackingCategoryEnabled &&
    (isMucusTrackingCategoryEnabled || isCervixTrackingCategoryEnabled)

  const sliderDisabledPrompt = () => {
    if (!isTemperatureTrackingCategoryEnabled) {
      Alert.alert(
        t(
          'hamburgerMenu.settings.customization.temperatureScale.disabled.title'
        ),
        t(
          'hamburgerMenu.settings.customization.temperatureScale.disabled.description'
        )
      )
    }
  }

  const fertilityDisabledPrompt = () => {
    if (!manageFertilityFeature) {
      Alert.alert(
        t(
          'hamburgerMenu.settings.customization.fertilityPhases.disabledModal.title'
        ),
        t(
          'hamburgerMenu.settings.customization.fertilityPhases.disabledModal.description'
        )
      )
    }
  }

  return (
    <AppPage title={labels.customization.title}>
      <Segment title={labels.customization.trackingCategories}>
        <TrackingCategorySwitch
          onToggle={temperatureTrackingCategoryToggle}
          text={t(`symptoms.${SYMPTOMS[1]}`)}
          value={isTemperatureTrackingCategoryEnabled}
          symptom={SYMPTOMS[1]}
        />
        <TrackingCategorySwitch
          onToggle={(enabled) => {
            mucusTrackingCategoryToggle(enabled)
          }}
          text={t(`symptoms.${SYMPTOMS[2]}`)}
          value={isMucusTrackingCategoryEnabled}
          symptom={SYMPTOMS[2]}
        />
        <TrackingCategorySwitch
          onToggle={(enabled) => {
            cervixTrackingCategoryToggle(enabled)
          }}
          text={t(`symptoms.${SYMPTOMS[3]}`)}
          value={isCervixTrackingCategoryEnabled}
          symptom={SYMPTOMS[3]}
        />
        <TrackingCategorySwitch
          onToggle={sexTrackingCategoryToggle}
          text={t(`symptoms.${SYMPTOMS[4]}`)}
          value={isSexTrackingCategoryEnabled}
          symptom={SYMPTOMS[4]}
        />
        <TrackingCategorySwitch
          onToggle={desireTrackingCategoryToggle}
          text={t(`symptoms.${SYMPTOMS[5]}`)}
          value={isDesireTrackingCategoryEnabled}
          symptom={SYMPTOMS[5]}
        />
        <TrackingCategorySwitch
          onToggle={painTrackingCategoryToggle}
          text={t(`symptoms.${SYMPTOMS[6]}`)}
          value={isPainTrackingCategoryEnabled}
          symptom={SYMPTOMS[6]}
        />
        <TrackingCategorySwitch
          onToggle={moodTrackingCategoryToggle}
          text={t(`symptoms.${SYMPTOMS[7]}`)}
          value={isMoodTrackingCategoryEnabled}
          symptom={SYMPTOMS[7]}
        />
        <TrackingCategorySwitch
          onToggle={noteTrackingCategoryToggle}
          text={t(`symptoms.${SYMPTOMS[8]}`)}
          value={isNoteTrackingCategoryEnabled}
          symptom={SYMPTOMS[8]}
        />
      </Segment>

      <Pressable onPress={fertilityDisabledPrompt}>
        <Segment
          title={t(
            'hamburgerMenu.settings.customization.fertilityPhases.title'
          )}
        >
          <AppText>
            {t(
              'hamburgerMenu.settings.customization.fertilityPhases.description'
            )}
          </AppText>
          <AppSwitch
            onToggle={fertilityTrackingToggle}
            text={fertilityTrackingText}
            value={isFertilityTrackingEnabled}
            disabled={!manageFertilityFeature}
          />
        </Segment>
      </Pressable>

      <PeriodPrediction />

      <Segment
        subheader={labels.customization.subheaderSymptoThermalMethod}
        last
      ></Segment>

      <Pressable onPress={sliderDisabledPrompt}>
        <Segment
          title={t(
            'hamburgerMenu.settings.customization.temperatureScale.title'
          )}
        >
          <AppText>
            {t(
              'hamburgerMenu.settings.customization.temperatureScale.description'
            )}
          </AppText>
          <TemperatureSlider disabled={!isTemperatureTrackingCategoryEnabled} />
        </Segment>
      </Pressable>

      <Pressable onPress={secondarySymptomDisabledPrompt}>
        <Segment
          title={t(
            'hamburgerMenu.settings.customization.secondarySymptom.title'
          )}
        >
          <AppText>
            {t('hamburgerMenu.settings.customization.secondarySymptom.text')}
          </AppText>
          <SelectTabGroup
            activeButton={useCervixAsSecondarySymptom}
            buttons={secondarySymptomButtons}
            onSelect={(value) => onSelectTab(value)}
            disabled={!isFertilityTrackingEnabled}
          />
        </Segment>
      </Pressable>
      <InfertileDaysInfo />
    </AppPage>
  )
}

export default Settings
