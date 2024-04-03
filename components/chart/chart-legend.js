import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import moment from 'moment'

import AppText from '../common/app-text'

import { Sizes, Typography } from '../../styles'
import { CHART_YAXIS_WIDTH } from '../../config'

const ChartLegend = ({ height, currentDate }) => {
  const displayedMonth = moment(currentDate).format('MMM')

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.singleLabelContainer, { height: height / 2 }]}>
        <AppText style={styles.textBold}>#</AppText>
      </View>
      <View style={[styles.singleLabelContainer, { height: height / 2 }]}>
        <AppText style={styles.text}>{displayedMonth}</AppText>
      </View>
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
  singleLabelContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    ...Typography.label,
    fontSize: Sizes.footnote,
  },
  textBold: {
    ...Typography.labelBold,
  },
})

export default ChartLegend
