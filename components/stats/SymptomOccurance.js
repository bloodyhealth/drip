import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Surface, Shape } from '@react-native-community/art'

import AppModal from '../common/app-modal'
import AppText from '../common/app-text'

import symOccModule from '../../lib/sympto-occurance'
import { Spacing, Typography, Colors, Sizes } from '../../styles'

const SymptomOccurance = ({ onClose }) => {
  const { t } = useTranslation(null, { keyPrefix: 'stats.symptoOccuDetails' })
  const cycleDays = symOccModule().getCycleStartsOfLastYear()
  if (!cycleDays || cycleDays.length === 0) return null

  const headacheDays = symOccModule().getPainDaysOfLastYear()

  const cycleDaysOfPain = symOccModule().getCycleDayForPainDays(
    cycleDays,
    headacheDays
  )

  const histData = symOccModule().buildHistogram(cycleDaysOfPain)
  const histDataFormatted = histData
    .map(([value, count]) => `${value}: ${count}`)
    .join(',\n')
  const histPath = symOccModule().histogramPath(histData, 260, 200)
  const labelPositions = Array.from(
    // first day each week
    { length: Math.ceil((histData.length - 1) / 7) },
    (_, index) => 1 + index * 7
  )

  return (
    <AppModal onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.accentCell}>
          <AppText style={styles.header}>{t('title')}</AppText>
        </View>
        <AppText>{'On the following cycle days:'}</AppText>
        <View>
          <Surface width={300} height={200}>
            <Shape d={histPath} fill="#3498db" />
          </Surface>
          <View>
            {labelPositions.map((position) => (
              <AppText
                key={position}
                style={{
                  position: 'absolute',
                  left: (position / histData.length) * 300 - 10,
                }}
              >
                {position}
              </AppText>
            ))}
          </View>
        </View>
        <View>
          <AppText style={styles.histData}>{histDataFormatted}</AppText>
        </View>
      </View>
    </AppModal>
  )
}

SymptomOccurance.propTypes = {
  onClose: PropTypes.func,
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.grey,
  },
  header: {
    ...Typography.accentOrange,
    paddingVertical: Spacing.small,
  },
  headerDivider: {
    borderBottomColor: Colors.purple,
    borderBottomWidth: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.tiny,
    backgroundColor: 'white',
  },
  cell: {
    flex: 2,
    justifyContent: 'center',
  },
  accentCell: {
    flex: 3,
    justifyContent: 'center',
  },
  container: {
    minHeight: '40%',
    minWidth: '95%',
    paddingHorizontal: Spacing.base,
  },
  histData: {
    // TODO clean up when no longer needed
    fontSize: Sizes.footnote,
  },
})

export default SymptomOccurance
