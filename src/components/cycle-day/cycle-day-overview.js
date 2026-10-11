import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import AppPage from '../common/app-page'
import SymptomBox from './symptom-box'
import SymptomPageTitle from './symptom-page-title'

import { getCycleDay } from '../../db'
import { getData, nextDate, prevDate } from '../helpers/cycle-day'

import {
  desireTrackingCategoryObservable,
  moodTrackingCategoryObservable,
  noteTrackingCategoryObservable,
  painTrackingCategoryObservable,
  sexTrackingCategoryObservable,
  temperatureTrackingCategoryObservable,
  mucusTrackingCategoryObservable,
  cervixTrackingCategoryObservable,
} from '../../local-storage'
import { Spacing } from '../../styles'
import { SYMPTOMS } from '../../config'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useRefreshOnFocus } from '@/context/navigation/use-refresh-on-focus'

const CycleDayOverView = () => {
  const { setParams } = useNavigation()
  const { params } = useRoute()
  const { date, isTemperatureEditView } = params
  useRefreshOnFocus()
  const cycleDay = getCycleDay(date)

  const [editedSymptom, setEditedSymptom] = useState(
    isTemperatureEditView ? 'temperature' : ''
  )

  // the screen stays mounted when it is opened again with new params,
  // e.g. by the temperature reminder while a cycle day is already shown
  useEffect(() => {
    if (isTemperatureEditView) setEditedSymptom('temperature')
  }, [params, isTemperatureEditView])

  const showNextCycleDay = () => {
    setParams({ date: nextDate(date), isTemperatureEditView: false })
  }

  const showPrevCycleDay = () => {
    setParams({ date: prevDate(date), isTemperatureEditView: false })
  }

  const allEnabledSymptoms = SYMPTOMS.map((symptom) => {
    if (symptom === 'temperature') {
      return temperatureTrackingCategoryObservable.value ? symptom : null
    } else if (symptom === 'sex') {
      return sexTrackingCategoryObservable.value ? symptom : null
    } else if (symptom === 'mucus') {
      return mucusTrackingCategoryObservable.value ? symptom : null
    } else if (symptom === 'cervix') {
      return cervixTrackingCategoryObservable.value ? symptom : null
    } else if (symptom === 'desire') {
      return desireTrackingCategoryObservable.value ? symptom : null
    } else if (symptom === 'pain') {
      return painTrackingCategoryObservable.value ? symptom : null
    } else if (symptom === 'mood') {
      return moodTrackingCategoryObservable.value ? symptom : null
    } else if (symptom === 'note') {
      return noteTrackingCategoryObservable.value ? symptom : null
    } else {
      return symptom
    }
  })
  const cleanSymptoms = allEnabledSymptoms.filter(Boolean)

  return (
    <AppPage>
      <SymptomPageTitle
        date={date}
        onNextCycleDay={showNextCycleDay}
        onPrevCycleDay={showPrevCycleDay}
      />
      <View style={styles.container}>
        {cleanSymptoms.map((symptom) => {
          const symptomData =
            cycleDay && cycleDay[symptom] ? cycleDay[symptom] : null

          return (
            <SymptomBox
              date={date}
              key={symptom}
              symptom={symptom}
              symptomData={symptomData}
              symptomDataToDisplay={getData(symptom, symptomData)}
              editedSymptom={editedSymptom}
              setEditedSymptom={setEditedSymptom}
            />
          )
        })}
      </View>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
})

export default CycleDayOverView
