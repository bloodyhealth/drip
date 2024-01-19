import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import AppPage from '../common/app-page'
import SymptomBox from './symptom-box'
import SymptomPageTitle from './symptom-page-title'

import { getCycleDay } from '../../db'
import { getData, nextDate, prevDate } from '../helpers/cycle-day'

import { sexTrackingCategoryObservable } from '../../local-storage'
import { bleedingTrackingCategoryObservable } from '../../local-storage'
import { Spacing } from '../../styles'
import { SYMPTOMS } from '../../config'

const CycleDayOverView = ({ date, setDate, isTemperatureEditView }) => {
  const cycleDay = getCycleDay(date)

  const [editedSymptom, setEditedSymptom] = useState(
    isTemperatureEditView ? 'temperature' : ''
  )

  const showNextCycleDay = () => {
    setDate(nextDate(date))
  }

  const showPrevCycleDay = () => {
    setDate(prevDate(date))
  }
  console.log('SYMPTOMS :>> ', SYMPTOMS)
  console.log(
    'bleedingTrackingCategoryObservable  :>> ',
    bleedingTrackingCategoryObservable
  )
  // maybe: observables are never declared if done with looping over the symptoms
  // const bleedingTrackingCategoryObservable = { value: true }
  // const temperatureTrackingCategoryObservable = {}

  const allEnabledSymptoms = SYMPTOMS.filter((symptom) => {
    const observableName = `${symptom}TrackingCategoryObservable`
    const isSymptomEnabled = new Function(`return ${observableName}.value`)()
    console.log('isSymptomEnabled :>> ', isSymptomEnabled)
    console.log('typeof isSymptomEnabled :>> ', typeof isSymptomEnabled)
    return isSymptomEnabled === true
  })

  console.log(allEnabledSymptoms)

  return (
    <AppPage>
      <SymptomPageTitle
        date={date}
        onNextCycleDay={showNextCycleDay}
        onPrevCycleDay={showPrevCycleDay}
      />
      <View style={styles.container}>
        {allEnabledSymptoms.map((symptom) => {
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

CycleDayOverView.propTypes = {
  cycleDay: PropTypes.object,
  date: PropTypes.string,
  setDate: PropTypes.func,
  isTemperatureEditView: PropTypes.bool,
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
