import React, { useState } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import Slider from '@ptomasroos/react-native-multi-slider'

import SliderLabel from './slider-label'
import { styles } from './slider-styles'
import alertError from '../common/alert-error'
import { scaleObservable, saveTempScale } from '../../../local-storage'
import { TEMP_MIN, TEMP_MAX, TEMP_SLIDER_STEP } from '../../../config'
import { useTranslation } from 'react-i18next'

const TemperatureSlider = ({ disabled }) => {
  const { t } = useTranslation(null, {
    keyPrefix: 'sideMenu.settings.customization.temperatureScale',
  })
  const savedValue = scaleObservable.value
  const [minTemperature, setMinTemperature] = useState(savedValue.min)
  const [maxTemperature, setMaxTemperature] = useState(savedValue.max)

  const onTemperatureSliderChange = ([min, max]) => {
    setMinTemperature(min)
    setMaxTemperature(max)
    try {
      saveTempScale({ min, max })
    } catch (err) {
      alertError(t('saveError'))
    }
  }

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
        max={TEMP_MAX}
        min={TEMP_MIN}
        onValuesChange={onTemperatureSliderChange}
        step={TEMP_SLIDER_STEP}
        trackStyle={styles.slider}
        values={[minTemperature, maxTemperature]}
        enabledOne={!disabled}
        enabledTwo={!disabled}
        selectedStyle={sliderAccentBackground}
        unselectedStyle={sliderBackground}
      />
    </View>
  )
}

export default TemperatureSlider

TemperatureSlider.propTypes = {
  disabled: PropTypes.bool,
}
