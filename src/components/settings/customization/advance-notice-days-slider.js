import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import Slider from '@ptomasroos/react-native-multi-slider'

import SliderLabel from './slider-label'
import { styles } from './slider-styles'
import {
  ADVANCE_PERIOD_NOTICE_DAYS_MIN,
  ADVANCE_PERIOD_NOTICE_DAYS_MAX,
} from '../../../config'

const AdvanceNoticeDaysSlider = ({
  disabled,
  advanceNoticeDays,
  onAdvanceNoticeDaysChange,
}) => {
  const sliderAccentBackground = disabled
    ? styles.disabledSliderAccentBackground
    : styles.sliderAccentBackground

  const sliderBackground = disabled
    ? styles.disabledSliderBackground
    : styles.sliderBackground

  return (
    <View style={styles.container}>
      <Slider
        customLabel={SliderLabel}
        enableLabel={true}
        markerStyle={styles.marker}
        markerOffsetY={styles.markerOffsetY}
        max={ADVANCE_PERIOD_NOTICE_DAYS_MAX}
        min={ADVANCE_PERIOD_NOTICE_DAYS_MIN}
        onValuesChange={onAdvanceNoticeDaysChange}
        step={1}
        showSteps={true}
        snapped={true}
        trackStyle={styles.slider}
        values={[advanceNoticeDays]}
        enabledOne={!disabled}
        enabledTwo={false}
        selectedStyle={sliderAccentBackground}
        unselectedStyle={sliderBackground}
      />
    </View>
  )
}

export default AdvanceNoticeDaysSlider

AdvanceNoticeDaysSlider.propTypes = {
  disabled: PropTypes.bool,
  advanceNoticeDays: PropTypes.number,
  onAdvanceNoticeDaysChange: PropTypes.func,
}
