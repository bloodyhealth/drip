import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { Colors } from '../../styles'

import { Svg } from 'react-native-svg'

import ChartLine from './chart-line'
import DotAndLine from './dot-and-line'

import { CHART_COLUMN_WIDTH, CHART_STROKE_WIDTH } from '../../config'

const TemperatureColumn = ({
  horizontalLinePosition,
  isVerticalLine,
  data,
  columnHeight,
  isWeekend,
}) => {
  const x = CHART_STROKE_WIDTH / 2

  const backgroundColor = isWeekend ? Colors.greyVeryLight : 'white'
  return (
    <View
      style={{
        width: CHART_COLUMN_WIDTH,
        height: columnHeight,
        backgroundColor,
      }}
    >
      <Svg width={CHART_COLUMN_WIDTH} height={columnHeight}>
        <ChartLine path={`M 0 0 L 0 ${columnHeight}`} />

        {horizontalLinePosition && (
          <ChartLine
            path={`M 0 ${horizontalLinePosition} L ${CHART_COLUMN_WIDTH} ${horizontalLinePosition}`}
            isNfpLine={true}
            key="ltl"
          />
        )}

        {isVerticalLine && (
          <ChartLine
            path={`M ${x} ${x} L ${x} ${columnHeight}`}
            isNfpLine={true}
            key="fhm"
          />
        )}

        {data && typeof data.y !== 'undefined' && (
          <DotAndLine
            y={data.y}
            exclude={data.temperatureExclude}
            rightY={data.rightY}
            rightTemperatureExclude={data.rightTemperatureExclude}
            leftY={data.leftY}
            leftTemperatureExclude={data.leftTemperatureExclude}
            key="dotandline"
          />
        )}
      </Svg>
    </View>
  )
}

TemperatureColumn.propTypes = {
  horizontalLinePosition: PropTypes.number,
  isVerticalLine: PropTypes.bool,
  data: PropTypes.object,
  columnHeight: PropTypes.number,
  isWeekend: PropTypes.bool,
}

export default TemperatureColumn
