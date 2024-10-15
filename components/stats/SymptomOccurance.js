import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
// import { useTranslation } from 'react-i18next'

import AppModal from '../common/app-modal'
import AppText from '../common/app-text'

import symOccModule from '../../lib/sympto-occurance'
import { Spacing, Typography, Colors } from '../../styles'

// const { t } = useTranslation(null, { keyPrefix: 'stats' })

const SymptomOccurance = ({ onClose }) => {
  const cycleDays = symOccModule().getCycleStartsOfLastYear()
  if (!cycleDays || cycleDays.length === 0) return false
  console.log('cycle starts:', cycleDays)

  const headacheDays = symOccModule().getPainDaysOfLastYear()
  console.log('pain', headacheDays)

  const cycleDaysOfPain = symOccModule().getCycleDayForPainDays(
    cycleDays,
    headacheDays
  )
  console.log('cycle days of pain', cycleDaysOfPain)

  return (
    <AppModal onClose={onClose}>
      <View>
        <FlatList
          ListHeaderComponent={FlatListHeader}
          contentContainerStyle={styles.container}
        />
      </View>
    </AppModal>
  )
}

SymptomOccurance.propTypes = {
  onClose: PropTypes.func,
}

const FlatListHeader = () => (
  <View style={styles.row}>
    <View style={styles.accentCell}>
      <AppText style={styles.header}>
        {'When did you experience headaches in the last year?'}
      </AppText>
    </View>
  </View>
)

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
})

export default SymptomOccurance
