import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'

import { getBleedingDaysSortedByDate } from '../db'
import cycleModule from '../lib/cycle'
import {
  calendarTheme,
  predictionToCalFormat,
  toCalFormat,
  todayToCalFormat,
  mergeContainerStyles,
} from './helpers/calendar'
import { mergeDeep } from '../common/object'

const CalendarView = ({ setDate, navigate }) => {
  const bleedingDays = getBleedingDaysSortedByDate()
  const predictedMenses = cycleModule().getPredictedMenses()

  const passDateToDayView = ({ dateString }) => {
    setDate(dateString)
    navigate('CycleDay')
  }

  const markedDates = mergeDeep(
    {
      ...todayToCalFormat(),
      ...toCalFormat(bleedingDays),
    },
    predictionToCalFormat(predictedMenses)
  )
  const baseObj = {
    '2025-06-12': {
      customStyles: {
        container: {
          backgroundColor: '#cf323d',
          paddingTop: 2.7411764705882353,
        },
        text: {
          color: '#E9F2ED',
        },
      },
    },
  }

  const overrideObj = {
    '2025-06-12': {
      customStyles: {
        container: {
          backgroundColor: '#ffffff',
          paddingBottom: 10,
        },
      },
    },
  }
  console.log('new')
  console.log(mergeDeep(baseObj, overrideObj)['2025-06-12'])

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
