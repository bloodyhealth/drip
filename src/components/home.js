import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import AppText from './common/app-text'
import Asterisk from './common/asterisk'
import Button from './common/button'
import Footnote from './common/footnote'

import { todayToFullDate } from './helpers/format-date'
import cycleModule from '../lib/cycle'
import { getFertilityStatusForDay } from '../lib/sympto-adapter'
import {
  determinePredictionText,
  formatWithOrdinalSuffix,
} from './helpers/home'
import {
  fertilityTrackingObservable,
  periodPredictionObservable,
} from '../local-storage'

import { Colors, Fonts, Sizes, Spacing } from '../styles'
import { LocalDate } from '@js-joda/core'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useRefreshOnFocus } from '@/navigation/use-refresh-on-focus'

const Home = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  useRefreshOnFocus()

  function navigateToCycleDayView() {
    navigate('CycleDay', { date: todayDateString })
  }

  const isFertilityTrackingEnabled = fertilityTrackingObservable.value
  const todayDateString = LocalDate.now().toString()
  const { getCycleDayNumber, getPredictedMenses } = cycleModule()
  const cycleDayNumber = getCycleDayNumber(todayDateString)
  const { status, phase, statusText } =
    isFertilityTrackingEnabled && getFertilityStatusForDay(todayDateString)
  const isPeriodPredictionEnabled = periodPredictionObservable.value
  const prediction = determinePredictionText(getPredictedMenses(), t)

  const cycleDayText = cycleDayNumber
    ? formatWithOrdinalSuffix(cycleDayNumber)
    : ''

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <AppText style={styles.title}>{todayToFullDate()}</AppText>

      {/* display if at least 1 bleeding day has been entered */}
      {cycleDayNumber && (
        <View style={styles.line}>
          <AppText style={styles.whiteSubtitle}>{cycleDayText}</AppText>
          <AppText style={styles.turquoiseText}>
            {t('labels.home.cycleDay')}
          </AppText>
        </View>
      )}

      {/* display if fertility tracking enabled and if phase 1, 2 or 3 has been identified  */}
      {isFertilityTrackingEnabled && phase && (
        <View style={styles.line}>
          <AppText style={styles.whiteSubtitle}>
            {formatWithOrdinalSuffix(phase)}
          </AppText>
          <AppText style={styles.turquoiseText}>
            {t('labels.home.cyclePhase')}
          </AppText>
          <AppText style={styles.turquoiseText}>{status}</AppText>
          <Asterisk />
        </View>
      )}

      {isPeriodPredictionEnabled && (
        <View style={styles.line}>
          <AppText style={styles.turquoiseText}>{prediction}</AppText>
        </View>
      )}

      {!isFertilityTrackingEnabled && <View style={styles.largePadding} />}
      <Button size="large" onPress={navigateToCycleDayView}>
        {t('labels.home.addDataForToday')}
      </Button>
      {phase && <Footnote color="light">{statusText}</Footnote>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purple,
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
    paddingTop: 0,
  },
  line: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    marginBottom: Spacing.tiny,
    marginTop: Spacing.small,
  },
  title: {
    color: Colors.purpleLight,
    ...Fonts.bold,
    fontSize: Sizes.huge,
    marginVertical: Spacing.small,
  },
  turquoiseText: {
    color: Colors.turquoise,
    fontSize: Sizes.subtitle,
  },
  whiteSubtitle: {
    color: 'white',
    fontSize: Sizes.subtitle,
  },
  largePadding: {
    padding: Spacing.large,
  },
})

export default Home
