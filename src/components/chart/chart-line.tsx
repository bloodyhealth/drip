import React from 'react'

import { Path } from 'react-native-svg'

import { Colors } from '../../styles'
import {
  CHART_STROKE_WIDTH,
  CHART_GRID_LINE_HORIZONTAL_WIDTH,
} from '../../config'

interface ChartLineProps {
  path: string
  isNfpLine?: boolean
}

const ChartLine = ({ path, isNfpLine = false }: ChartLineProps) => {
  const color = isNfpLine ? Colors.orange : Colors.grey
  const width = isNfpLine
    ? CHART_STROKE_WIDTH
    : CHART_GRID_LINE_HORIZONTAL_WIDTH * 2.5

  return <Path d={path} stroke={color} strokeWidth={width} />
}

export default ChartLine
