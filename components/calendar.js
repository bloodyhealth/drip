import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import { useTranslation } from 'react-i18next'

import { getBleedingDaysSortedByDate } from '../db'
import cycleModule from '../lib/cycle'
import {
  calendarTheme,
  predictionToCalFormat,
  setCalendarLocale,
  toCalFormat,
  todayToCalFormat,
} from './helpers/calendar'
import { mergeDeep } from '../common/object'

const CalendarView = ({ setDate, navigate }) => {
  const { t, i18n } = useTranslation()
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

  setCalendarLocale(i18n.language, t)

  return (
    <View style={styles.container}>
      <CalendarList
        key={i18n.language}
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
