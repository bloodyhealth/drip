import React from 'react'
import { Dimensions, FlatList, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import AppText from './app-text'
import CloseIcon from './close-icon'

import cycleModule from '../../lib/cycle'
import { Sizes, Spacing, Typography, Colors } from '../../styles'
import { humanizeDate } from '../helpers/format-date'

const Item = ({ data }) => {
  const { t } = useTranslation(null, { keyPrefix: 'plurals' })

  if (!data) return false

  const { date, cycleLength, bleedingLength } = data

  return (
    <View style={styles.row}>
      <View style={styles.accentCell}>
        <AppText>{humanizeDate(date)}</AppText>
      </View>
      <View style={styles.cell}>
        <AppText>{t('day', { count: cycleLength })}</AppText>
      </View>
      <View style={styles.cell}>
        <AppText>{t('day', { count: bleedingLength })}</AppText>
      </View>
    </View>
  )
}

Item.propTypes = {
  data: PropTypes.object.isRequired,
}

const StatsTable = ({ onClose }) => {
  const renderItem = ({ item }) => <Item data={item} />
  const data = cycleModule().getStats()

  if (!data || data.length === 0) return false

  return (
    <View style={styles.modalContainer}>
      <View style={styles.headerContainer}>
        <CloseIcon onClose={onClose} />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        ItemSeparatorComponent={ItemDivider}
        ListHeaderComponent={FlatListHeader}
        ListHeaderComponentStyle={styles.headerDivider}
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.container}
      />
    </View>
  )
}

StatsTable.propTypes = {
  onClose: PropTypes.func,
}

const ItemDivider = () => <View style={styles.divider} />

const FlatListHeader = () => (
  <View style={styles.row}>
    <View style={styles.accentCell}>
      <AppText style={styles.header}>{'Cycle Start'}</AppText>
    </View>
    <View style={styles.cell}>
      <AppText style={styles.header}>{'Cycle Length'}</AppText>
    </View>
    <View style={styles.cell}>
      <AppText style={styles.header}>{'Bleeding'}</AppText>
    </View>
  </View>
)

const styles = StyleSheet.create({
  accentCell: {
    flex: 3,
    justifyContent: 'center',
  },
  cell: {
    flex: 2,
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: Spacing.base,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.grey,
  },
  header: {
    ...Typography.accentOrange,
    paddingVertical: Spacing.small,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: Spacing.base,
    paddingRight: Spacing.base,
  },
  headerDivider: {
    borderBottomColor: Colors.purple,
    borderBottomWidth: 2,
  },
  modalContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.turquoiseLight,
    marginTop: Sizes.huge * 2,
    maxHeight: Dimensions.get('window').height * 0.7,
    minHeight: '40%',
    position: 'absolute',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.tiny,
    backgroundColor: Colors.turquoiseLight,
  },
})

export default StatsTable
