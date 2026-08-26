import React from 'react'
import PropTypes from 'prop-types'
import { Path, Circle } from 'react-native-svg'

import { Colors } from '../../styles'

import {
  CHART_COLUMN_WIDTH,
  CHART_COLUMN_MIDDLE,
  CHART_DOT_RADIUS_SYMPTOM,
  CHART_DOT_RADIUS_TEMPERATURE,
  CHART_STROKE_WIDTH,
} from '../../config'

const DotAndLine = ({
  exclude,
  leftTemperatureExclude,
  leftY,
  rightTemperatureExclude,
  rightY,
  y,
}) => {
  let excludeLeftLine, excludeRightLine, lineLeft, lineRight

  if (leftY) {
    const middleY = (leftY - y) / 2 + y
    excludeLeftLine = leftTemperatureExclude || exclude
    lineLeft = `M ${CHART_COLUMN_MIDDLE} ${y} L 0 ${middleY}`
  }
  if (rightY) {
    const middleY = (y - rightY) / 2 + rightY
    excludeRightLine = rightTemperatureExclude || exclude
    lineRight = `M ${CHART_COLUMN_MIDDLE} ${y} L ${CHART_COLUMN_WIDTH} ${middleY}`
  }

  const dotColor = exclude ? Colors.turquoise : Colors.turquoiseDark
  const lineColorLeft = excludeLeftLine
    ? Colors.turquoise
    : Colors.turquoiseDark
  const lineColorRight = excludeRightLine
    ? Colors.turquoise
    : Colors.turquoiseDark

  return (
    <React.Fragment>
      {lineLeft && (
        <Path
          d={lineLeft}
          stroke={lineColorLeft}
          strokeWidth={CHART_STROKE_WIDTH}
          key={y}
        />
      )}
      {lineRight && (
        <Path
          d={lineRight}
          stroke={lineColorRight}
          strokeWidth={CHART_STROKE_WIDTH}
          key={y + CHART_DOT_RADIUS_SYMPTOM}
        />
      )}
      <Circle
        cx={CHART_COLUMN_MIDDLE}
        cy={y}
        r={CHART_DOT_RADIUS_TEMPERATURE}
        stroke={dotColor}
        strokeWidth={CHART_STROKE_WIDTH}
        fill={dotColor}
        key="dot"
      />
    </React.Fragment>
  )
}

DotAndLine.propTypes = {
  exclude: PropTypes.bool,
  leftY: PropTypes.number,
  leftTemperatureExclude: PropTypes.bool,
  rightY: PropTypes.number,
  rightTemperatureExclude: PropTypes.bool,
  y: PropTypes.number.isRequired,
}

export default DotAndLine
