import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'

import { getBleedingDaysSortedByDate } from '../db'
import cycleModule from '../lib/cycle'
import nothingChanged from '../db/db-unchanged'
import {
  calendarTheme,
  predictionToCalFormat,
  toCalFormat,
  todayToCalFormat,
} from './helpers/calendar'

const CalendarView = ({ setDate, navigate }) => {
  const bleedingDays = getBleedingDaysSortedByDate()
  const predictedMenses = cycleModule().getPredictedMenses()

  const [bleedingDaysInCalFormat, setBleedingDaysInCalFormat] = useState(
    toCalFormat(bleedingDays)
  )
  const [
    predictedBleedingDaysInCalFormat,
    setPredictedBleedingDaysInCalFormat,
  ] = useState(predictionToCalFormat(predictedMenses))
  const [todayInCalFormat, setTodayInCalFormat] = useState(todayToCalFormat())

  useEffect(() => {
    bleedingDays.addListener(setStateWithCalFormattedDays)
    return () => {
      bleedingDays.removeListener(setStateWithCalFormattedDays)
    }
  }, [])

  const setStateWithCalFormattedDays = (_, changes) => {
    if (nothingChanged(changes)) return
    const predictedMenses = cycleModule().getPredictedMenses()
    setBleedingDaysInCalFormat(toCalFormat(bleedingDays))
    setPredictedBleedingDaysInCalFormat(predictionToCalFormat(predictedMenses))
    setTodayInCalFormat(todayToCalFormat())
  }

  const passDateToDayView = (result) => {
    setDate(result.dateString)
    navigate('CycleDay')
  }

  const markedDates = Object.assign(
    {},
    todayInCalFormat,
    bleedingDaysInCalFormat,
    predictedBleedingDaysInCalFormat
  )

  return (
    <View style={styles.container}>
      <CalendarList
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        onDayPress={passDateToDayView}
        markedDates={markedDates}
        markingType="custom"
        theme={calendarTheme}
        // Max amount of months allowed to scroll to the past.
        pastScrollRange={120}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

CalendarView.propTypes = {
  setDate: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
}

export default CalendarView
