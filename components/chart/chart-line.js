import React from 'react'
import PropTypes from 'prop-types'

import { Shape } from '@react-native-community/art'

import { Colors } from '../../styles'
import {
  CHART_STROKE_WIDTH,
  CHART_GRID_LINE_HORIZONTAL_WIDTH,
} from '../../config'

const ChartLine = ({ path, isNfpLine }) => {
  const color = isNfpLine ? Colors.orange : Colors.grey
  const width = isNfpLine
    ? CHART_STROKE_WIDTH
    : CHART_GRID_LINE_HORIZONTAL_WIDTH * 2.5

  return <Shape d={path} stroke={color} strokeWidth={width} />
}

ChartLine.propTypes = {
  path: PropTypes.object,
  isNfpLine: PropTypes.bool,
}

ChartLine.defaultProps = {
  isNfpLine: false,
}

export default ChartLine
