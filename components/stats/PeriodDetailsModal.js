import React, { useRef, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import AppModal from '../common/app-modal'
import AppText from '../common/app-text'

import cycleModule from '../../lib/cycle'
import { Colors, Spacing, Typography } from '../../styles'
import { humanizeDate } from '../helpers/format-date'
import LoadingMoreView from '../chart/loading-more'
import { BATCH_SIZE } from '../../config'

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

const PeriodDetailsModal = ({ onClose }) => {
  const start = useRef(0)
  const end = useRef(BATCH_SIZE)
  const renderItem = ({ item }) => <Item data={item} />
  const [endReached, setEndReached] = useState(false)

  const firstBatch = cycleModule().computeNextStatsBatch(
    start.current,
    end.current
  )
  const [stats, setStats] = useState(firstBatch)

  if (!stats || stats.length === 0) return false

  const loadMoreStats = () => {
    start.current += BATCH_SIZE
    end.current += BATCH_SIZE
    const nextBatch = cycleModule().computeNextStatsBatch(
      start.current,
      end.current
    )
    setStats((prev) => [...prev, ...nextBatch])
  }

  return (
    <AppModal onClose={onClose}>
      <View>
        <FlatList
          data={stats}
          renderItem={renderItem}
          // getItemLayout={getItemLayout}
          keyExtractor={(item) => item.date}
          ItemSeparatorComponent={ItemDivider}
          ListHeaderComponent={FlatListHeader}
          ListHeaderComponentStyle={styles.headerDivider}
          stickyHeaderIndices={[0]}
          windowSize={4}
          contentContainerStyle={styles.container}
          onEndReached={() => {
            setEndReached(true)
            loadMoreStats()
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<LoadingMoreView end={endReached} />}
          updateCellsBatchingPeriod={100}
        />
      </View>
    </AppModal>
  )
}

PeriodDetailsModal.propTypes = {
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

export default PeriodDetailsModal
