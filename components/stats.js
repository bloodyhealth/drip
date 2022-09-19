import React, { useState } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, View } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { useTranslation } from 'react-i18next'

import Button from './common/button'
import AppHelp from './common/AppHelp'
import AppModal from './common/app-modal'
import AppText from './common/app-text'
import StatsOverview from './common/StatsOverview'
import StatsTable from './common/StatsTable'

import cycleModule from '../lib/cycle'
import { getCycleLengthStats as getCycleInfo } from '../lib/cycle-length'
import { stats as labels } from '../i18n/en/labels'

import { Containers, Sizes, Spacing, Typography } from '../styles'

const image = require('../assets/cycle-icon.png')

const Stats = () => {
  const [isStatsVisible, setIsStatsVisible] = useState(false)

  const { t } = useTranslation(null, { keyPrefix: 'stats' })

  const cycleLengths = cycleModule().getAllCycleLengths()
  const numberOfCycles = cycleLengths.length
  const hasAtLeastOneCycle = numberOfCycles >= 1
  const cycleData = hasAtLeastOneCycle
    ? getCycleInfo(cycleLengths)
    : { minimum: '—', maximum: '—', stdDeviation: '—' }
  const statsData = [
    [cycleData.minimum, t('min')],
    [cycleData.maximum, t('max')],
    [
      cycleData.stdDeviation ? cycleData.stdDeviation : '—',
      t('standard_deviation'),
    ],
    [numberOfCycles, t('completed_cycles')],
  ]

  return (
    <SafeAreaView style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.overviewContainer}>
        <AppText>{t('cycle_length_explainer')}</AppText>
        {!hasAtLeastOneCycle && <AppText>{t('no_data')}</AppText>}
        {hasAtLeastOneCycle && (
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
                  <AppText style={styles.accentPurpleHuge}>{t('days')}</AppText>
                </ImageBackground>
                <AppText style={styles.accentOrange}>{t('average')}</AppText>
              </View>
              <View style={styles.columnRight}>
                <StatsOverview data={statsData} />
              </View>
            </View>
            <Button isCTA onPress={() => setIsStatsVisible(true)}>
              {t('show_stats')}
            </Button>
            <AppHelp text={t('standard_deviation_help')} />
          </>
        )}
      </ScrollView>

      {isStatsVisible && (
        <AppModal onClose={() => setIsStatsVisible(false)}>
          <StatsTable onClose={() => setIsStatsVisible(false)} />
        </AppModal>
      )}
    </SafeAreaView>
  )
}

const column = {
  flexDirection: 'column',
}

const styles = ScaledSheet.create({
  accentOrange: {
    ...Typography.accentOrange,
    fontSize: Sizes.small,
  },
  accentPurpleGiant: {
    ...Typography.accentPurpleGiant,
    marginTop: Spacing.base * -2,
  },
  accentPurpleHuge: {
    ...Typography.accentPurpleHuge,
    marginTop: Spacing.base * -1,
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
    paddingTop: Spacing.small,
  },
  image: {
    resizeMode: 'contain',
  },
  imageContainter: {
    paddingTop: Spacing.large * 2.5,
    marginBottom: Spacing.large,
  },
  overviewContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  pageContainer: {
    ...Containers.pageContainer,
  },
})

export default Stats
