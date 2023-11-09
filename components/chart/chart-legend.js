import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import moment from 'moment'

import AppText from '../common/app-text'

import { Typography } from '../../styles'
import { CHART_YAXIS_WIDTH } from '../../config'

const ChartLegend = ({ height, currentDate }) => {
  const displayedMonth = moment(currentDate).format('MMM')

  return (
    <View style={[styles.container, { height }]}>
      <AppText style={styles.textBold}>#</AppText>
      <AppText style={styles.text}>{displayedMonth}</AppText>
    </View>
  )
}

ChartLegend.propTypes = {
  height: PropTypes.number.isRequired,
  currentDate: PropTypes.string,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: CHART_YAXIS_WIDTH,
  },
  text: {
    ...Typography.label,
  },
  textBold: {
    ...Typography.labelBold,
  },
})

export default ChartLegend
