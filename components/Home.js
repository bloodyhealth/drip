import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import moment from 'moment'

import AppText from './common/app-text'
import Button from './common/button'

import cycleModule from '../lib/cycle'
import { getFertilityStatusForDay } from '../lib/sympto-adapter'
import {
  determinePredictionText,
  formatWithOrdinalSuffix,
} from './helpers/home'

import { Colors, Fonts, Sizes, Spacing } from '../styles'
import { LocalDate } from '@js-joda/core'
import { useTranslation } from 'react-i18next'

const Home = ({ navigate, setDate }) => {
  const { t } = useTranslation()

  function navigateToCycleDayView() {
    setDate(todayDateString)
    navigate('CycleDay')
  }

  const todayDateString = LocalDate.now().toString()
  const { getCycleDayNumber, getPredictedMenses } = cycleModule()
  const cycleDayNumber = getCycleDayNumber(todayDateString)
  const { status, phase, statusText } =
    getFertilityStatusForDay(todayDateString)
  const prediction = determinePredictionText(getPredictedMenses(), t)

  const cycleDayText = cycleDayNumber
    ? formatWithOrdinalSuffix(cycleDayNumber)
    : ''

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <AppText style={styles.title}>{moment().format('MMM Do YYYY')}</AppText>

      {cycleDayNumber && (
        <View style={styles.line}>
          <AppText style={styles.whiteSubtitle}>{cycleDayText}</AppText>
          <AppText style={styles.turquoiseText}>
            {t('labels.home.cycleDay')}
          </AppText>
        </View>
      )}
      {phase && (
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
      <View style={styles.line}>
        <AppText style={styles.turquoiseText}>{prediction}</AppText>
      </View>
      <Button isCTA isSmall={false} onPress={navigateToCycleDayView}>
        {t('labels.home.addDataForToday')}
      </Button>
      {phase && (
        <View style={styles.asteriskLine}>
          <Asterisk />
          <AppText linkStyle={styles.whiteText} style={styles.greyText}>
            {statusText}
          </AppText>
        </View>
      )}
    </ScrollView>
  )
}

const Asterisk = () => {
  return <AppText style={styles.asterisk}>*</AppText>
}

const styles = StyleSheet.create({
  asterisk: {
    color: Colors.orange,
  },
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
  asteriskLine: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    marginBottom: Spacing.tiny,
    marginTop: Spacing.small,
  },
  title: {
    color: Colors.purpleLight,
    fontFamily: Fonts.bold,
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
  whiteText: {
    color: 'white',
  },
  greyText: {
    color: Colors.greyLight,
    paddingLeft: Spacing.base,
  },
})

Home.propTypes = {
  navigate: PropTypes.func,
  setDate: PropTypes.func,
}

export default Home
