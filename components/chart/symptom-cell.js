import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

import { Colors, Containers } from '../../styles'
import {
  CHART_COLUMN_WIDTH,
  CHART_DOT_RADIUS_SYMPTOM,
  CHART_GRID_LINE_HORIZONTAL_WIDTH,
} from '../../config'

const SymptomCell = ({
  height,
  index,
  symptom,
  symptomValue,
  isSymptomDataComplete,
  isWeekend,
}) => {
  const shouldDrawDot = symptomValue !== false
  // Determine the background color based on isWeekend prop
  const backgroundColor = isWeekend ? Colors.greyVeryLight : 'white'
  const styleCell =
    index !== 0
      ? [
          styles.cell,
          {
            height,
            width: CHART_COLUMN_WIDTH,
            backgroundColor: backgroundColor,
          },
        ]
      : [
          styles.cell,
          {
            height,
            width: CHART_COLUMN_WIDTH,
            backgroundColor: backgroundColor,
          },
          styles.topBorder,
        ]
  let styleDot
  if (shouldDrawDot) {
    const styleSymptom = Colors.iconColors[symptom]
    const symptomColor = styleSymptom.shades[symptomValue]
    const isMucusOrCervix = symptom === 'mucus' || symptom === 'cervix'
    const backgroundColor =
      isMucusOrCervix && !isSymptomDataComplete ? 'white' : symptomColor
    const borderWidth = isMucusOrCervix && !isSymptomDataComplete ? 2 : 0
    const borderColor = symptomColor
    styleDot = [styles.dot, { backgroundColor, borderColor, borderWidth }]
  }

  return (
    <View style={styleCell} key={symptom}>
      {shouldDrawDot && <View style={styleDot} />}
    </View>
  )
}

SymptomCell.propTypes = {
  height: PropTypes.number,
  index: PropTypes.number.isRequired,
  symptom: PropTypes.string,
  symptomValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  isSymptomDataComplete: PropTypes.bool,
  isWeekend: PropTypes.bool,
}

const styles = StyleSheet.create({
  cell: {
    borderBottomColor: Colors.grey,
    borderBottomWidth: CHART_GRID_LINE_HORIZONTAL_WIDTH,
    borderLeftColor: Colors.grey,
    borderLeftWidth: CHART_GRID_LINE_HORIZONTAL_WIDTH,
    ...Containers.centerItems,
  },
  topBorder: {
    borderTopColor: Colors.grey,
    borderTopWidth: CHART_GRID_LINE_HORIZONTAL_WIDTH,
  },
  dot: {
    width: CHART_DOT_RADIUS_SYMPTOM * 2,
    height: CHART_DOT_RADIUS_SYMPTOM * 2,
    borderRadius: 50,
  },
})
export default SymptomCell
