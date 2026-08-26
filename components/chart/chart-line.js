import React from 'react'
import PropTypes from 'prop-types'

import { Path } from 'react-native-svg'

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

  return <Path d={path} stroke={color} strokeWidth={width} />
}

ChartLine.propTypes = {
  path: PropTypes.string,
  isNfpLine: PropTypes.bool,
}

ChartLine.defaultProps = {
  isNfpLine: false,
}

export default ChartLine
