import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import AppText from './app-text'

import cycleModule from '../../lib/cycle'
import { Spacing, Typography, Colors } from '../../styles'

const formatDuration = (duration) =>
  duration === 1 ? `${duration} day` : `${duration} days`

const Item = ({ data }) => (
  <View style={styles.row}>
    <AppText>{data?.date}</AppText>
    <AppText>{formatDuration(data?.cycleLength)}</AppText>
    <AppText>{formatDuration(data?.bleedingLength)}</AppText>
  </View>
)

Item.propTypes = {
  data: PropTypes.object.isRequired,
}

const StatsTable = () => {
  const renderItem = ({ item }) => <Item data={item} />
  const { getStats } = cycleModule()

  return (
    <FlatList
      data={getStats()}
      renderItem={renderItem}
      keyExtractor={(item) => item.date}
      ItemSeparatorComponent={ItemDivider}
      ListHeaderComponent={FlatListHeader}
      ListHeaderComponentStyle={styles.headerDivider}
      stickyHeaderIndices={[0]}
      contentContainerStyle={styles.container}
    />
  )
}

const ItemDivider = () => <View style={styles.divider} />

const FlatListHeader = () => (
  <View style={styles.row}>
    <AppText style={styles.header}>{'Cycle Start'}</AppText>
    <AppText style={styles.header}>{'Cycle Length'}</AppText>
    <AppText style={styles.header}>{'Bleeding'}</AppText>
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
    backgroundColor: Colors.turquoiseLight,
  },
  container: {
    paddingHorizontal: Spacing.base,
  },
})

export default StatsTable
