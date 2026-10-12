import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import { LocalDate } from '@js-joda/core'

import {
  getBleedingDaysSortedByDate,
  getCycleModule,
  getDataVersion,
} from '../db'
import {
  calendarTheme,
  predictionToCalFormat,
  toCalFormat,
  todayToCalFormat,
} from './helpers/calendar'
import { mergeDeep } from '../common/object'
import { useNavigation } from '@react-navigation/native'
import { useRefreshOnFocus } from '@/context/navigation/use-refresh-on-focus'
import { periodPredictionObservable } from '@/local-storage'

let markedDatesCache = { key: null, markedDates: null }

const getMarkedDates = () => {
  const key = [
    getDataVersion(),
    LocalDate.now().toString(),
    periodPredictionObservable.value,
  ].join()
  if (key !== markedDatesCache.key) {
    markedDatesCache = { key, markedDates: buildMarkedDates() }
  }
  return markedDatesCache.markedDates
}

const buildMarkedDates = () => {
  const bleedingDays = getBleedingDaysSortedByDate()
  const predictedMenses = getCycleModule().getPredictedMenses()

  return mergeDeep(
    {
      ...todayToCalFormat(),
      ...toCalFormat(bleedingDays),
    },
    predictionToCalFormat(predictedMenses)
  )
}

const CalendarView = () => {
  const { navigate } = useNavigation()
  useRefreshOnFocus()

  const passDateToDayView = useCallback(
    ({ dateString }) => {
      navigate('CycleDay', { date: dateString })
    },
    [navigate]
  )

  const markedDates = getMarkedDates()

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

export default CalendarView
