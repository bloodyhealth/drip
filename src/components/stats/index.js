import React, { useState } from 'react'
import { ImageBackground, StyleSheet, ScrollView, View } from 'react-native'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { AppText } from '../common/app-text'
import Button from '../common/button'
import Footnote from '../common/footnote'
import StatsOverview from './stats-overview'
import PeriodDetailsModal from './period-details-modal'

import cycleModule from '../../lib/cycle'
import { getCycleLengthStats as getCycleInfo } from '../../lib/cycle-length'
import { formatDecimal } from '../helpers/cycle-day'

import { Containers, Sizes, Spacing, Typography } from '../../styles'
import { scale } from '../../common/scale-utils'

const image = require('../../assets/images/cycle-icon.png')

const Stats = () => {
  const { t } = useTranslation(null, { keyPrefix: 'stats' })

  const cycleLengths = cycleModule().getAllCycleLengths()
  const numberOfCycles = cycleLengths.length
  const hasData = numberOfCycles > 0
  const cycleData = hasData
    ? getCycleInfo(cycleLengths)
    : { minimum: '—', maximum: '—', stdDeviation: '—' }

  const standardDeviation = cycleData.stdDeviation
    ? formatDecimal(cycleData.stdDeviation, 1)
    : '—'
  const statsData = [
    { value: cycleData.minimum, label: t('overview.min') },
    { value: cycleData.maximum, label: t('overview.max') },
    {
      value: standardDeviation,
      valuePrefix: cycleData.stdDeviation ? '±' : undefined,
      label: t('overview.standardDeviation'),
      hasAsterisk: true,
    },
    { value: numberOfCycles, label: t('overview.completedCycles') },
  ]

  if (cycleData.mean) {
    cycleData.mean = formatDecimal(cycleData.mean, 1)
  }

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.overviewContainer}>
        <AppText style={hasData ? styles.titleWithoutMargin : styles.title}>
          {t('intro')}
        </AppText>
        {hasData ? (
          <StatsContent mean={cycleData.mean} data={statsData} />
        ) : (
          <AppText>{t('noData')}</AppText>
        )}
      </ScrollView>
    </View>
  )
}

const StatsContent = ({ mean, data }) => {
  const [isPeriodDetailsModalOpen, setIsPeriodDetailsModalOpen] =
    useState(false)
  const { t } = useTranslation(null, { keyPrefix: 'stats' })

  return (
    <>
      <View style={styles.container}>
        <View style={styles.columnLeft}>
          <ImageBackground
            source={image}
            imageStyle={styles.image}
            style={styles.imageContainter}
          >
            <AppText
              numberOfLines={1}
              ellipsizeMode="clip"
              style={styles.accentPurpleGiant}
            >
              {mean}
            </AppText>
            <AppText style={styles.accentPurpleHuge}>
              {t('overview.days')}
            </AppText>
          </ImageBackground>
          <AppText style={styles.accentOrange}>{t('overview.average')}</AppText>
        </View>
        <View style={styles.columnRight}>
          <StatsOverview data={data} />
        </View>
      </View>
      <Button onPress={() => setIsPeriodDetailsModalOpen(true)}>
        {t('showStats.button')}
      </Button>
      {isPeriodDetailsModalOpen && (
        <PeriodDetailsModal
          onClose={() => setIsPeriodDetailsModalOpen(false)}
        />
      )}
      <Footnote>{t('footnote')}</Footnote>
    </>
  )
}

StatsContent.propTypes = {
  mean: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.array.isRequired,
}

const column = {
  flexDirection: 'column',
}

const styles = StyleSheet.create({
  accentOrange: {
    ...Typography.accentOrange,
    fontSize: scale(Sizes.small),
  },
  accentPurpleGiant: {
    ...Typography.accentPurpleGiant,
    marginTop: scale(Spacing.base * -2),
  },
  accentPurpleHuge: {
    ...Typography.accentPurpleHuge,
    marginTop: scale(Spacing.base * -1),
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnLeft: {
    ...column,
    flex: 3,
  },
  columnRight: {
    ...column,
    flex: 5,
    paddingTop: scale(Spacing.small),
  },
  image: {
    resizeMode: 'contain',
  },
  imageContainter: {
    paddingTop: scale(Spacing.large * 2.5),
    marginBottom: scale(Spacing.large),
  },
  overviewContainer: {
    paddingHorizontal: scale(Spacing.base),
    paddingTop: scale(Spacing.base),
  },
  pageContainer: {
    ...Containers.pageContainer,
  },
  title: {
    ...Typography.title,
  },
  titleWithoutMargin: {
    ...Typography.titleWithoutMargin,
  },
})
export default Stats
