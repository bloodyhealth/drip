import React, { useState } from 'react'
import { ImageBackground, StyleSheet, ScrollView, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import AppText from '../common/app-text'
import Button from '../common/button'
import Footnote from '../common/footnote'
import StatsOverview from './stats-overview'
import PeriodDetailsModal from './period-details-modal'

import cycleModule from '../../lib/cycle'
import { getCycleLengthStats as getCycleInfo } from '../../lib/cycle-length'
import { formatDecimal } from '../helpers/cycle-day'

import { Containers, Sizes, Spacing, Typography } from '../../styles'
import { scale, verticalScale } from '../../common/scale-utils'
import { SafeAreaView } from 'react-native-safe-area-context'

const image = require('../../assets/cycle-icon.png')

const Stats = () => {
  const [isStatsVisible, setIsStatsVisible] = useState(false)

  const { t } = useTranslation(null, { keyPrefix: 'stats' })

  const cycleLengths = cycleModule().getAllCycleLengths()
  const numberOfCycles = cycleLengths.length
  const cycleData =
    numberOfCycles > 0
      ? getCycleInfo(cycleLengths)
      : { minimum: '—', maximum: '—', stdDeviation: '—' }

  const standardDeviation = cycleData.stdDeviation
    ? cycleData.stdDeviation
    : '—'
  const statsData = [
    [cycleData.minimum, t('overview.min')],
    [cycleData.maximum, t('overview.max')],
    [standardDeviation, t('overview.standardDeviation')],
    [numberOfCycles, t('overview.completedCycles')],
  ]

  if (cycleData.mean) {
    cycleData.mean = formatDecimal(cycleData.mean, 1)
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.overviewContainer}>
        <AppText>{t('intro')}</AppText>
        {numberOfCycles === 0 ? (
          <AppText>{t('noData')}</AppText>
        ) : (
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
                    {cycleData.mean}
                  </AppText>
                  <AppText style={styles.accentPurpleHuge}>
                    {t('overview.days')}
                  </AppText>
                </ImageBackground>
                <AppText style={styles.accentOrange}>
                  {t('overview.average')}
                </AppText>
              </View>
              <View style={styles.columnRight}>
                <StatsOverview data={statsData} />
              </View>
            </View>
            <Button isCTA onPress={() => setIsStatsVisible(true)}>
              {t('showStats')}
            </Button>
            {isStatsVisible && (
              <PeriodDetailsModal onClose={() => setIsStatsVisible(false)} />
            )}
            <Footnote>{t('footnote')}</Footnote>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
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
    marginTop: verticalScale(Spacing.base * -2),
  },
  accentPurpleHuge: {
    ...Typography.accentPurpleHuge,
    marginTop: verticalScale(Spacing.base * -1),
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
    paddingTop: verticalScale(Spacing.small),
  },
  image: {
    resizeMode: 'contain',
  },
  imageContainter: {
    paddingTop: verticalScale(Spacing.large * 2.5),
    marginBottom: verticalScale(Spacing.large),
  },
  overviewContainer: {
    paddingHorizontal: scale(Spacing.base),
    paddingTop: verticalScale(Spacing.base),
  },
  pageContainer: {
    ...Containers.pageContainer,
  },
})
export default Stats
