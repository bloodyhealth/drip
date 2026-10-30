import React from 'react'
import { StyleSheet, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import { useTranslation } from 'react-i18next'

import { getBleedingDaysSortedByDate } from '../db'
import cycleModule from '../lib/cycle'
import {
  calendarTheme,
  predictionToCalFormat,
  toCalFormat,
  todayToCalFormat,
} from './helpers/calendar'
import { mergeDeep } from '../common/object'
import { useNavigation } from '@react-navigation/native'
import { useRefreshOnFocus } from '@/navigation/use-refresh-on-focus'

const CalendarView = () => {
  const { navigate } = useNavigation()
  useRefreshOnFocus()
  const { i18n } = useTranslation()
  const bleedingDays = getBleedingDaysSortedByDate()
  const predictedMenses = cycleModule().getPredictedMenses()

  const passDateToDayView = ({ dateString }) => {
    navigate('CycleDay', { date: dateString })
  }

  const markedDates = mergeDeep(
    {
      ...todayToCalFormat(),
      ...toCalFormat(bleedingDays),
    },
    predictionToCalFormat(predictedMenses)
  )

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

export default CalendarView
