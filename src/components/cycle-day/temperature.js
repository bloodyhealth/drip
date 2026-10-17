import React, { useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { Keyboard } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'

import AppText from '../common/app-text'
import AppTextInput from '../common/app-text-input'
import Segment from '../common/segment'

import {
  getTemperatureOutOfRangeMessage,
  formatTemperature,
} from '../helpers/cycle-day'

import { Colors, Containers, Sizes, Spacing } from '../../styles'
import { useTranslation } from 'react-i18next'

const Temperature = ({ data, save }) => {
  const { t } = useTranslation()
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)
  const [temperature, setTemperature] = useState(formatTemperature(data.value))

  function onChangeTemperature(value) {
    const formattedValue = value.replace(',', '.').trim()
    if (!Number(formattedValue) && value !== '') return false
    setTemperature(formattedValue)
    save(formattedValue, 'value')
  }

  function onShowTimePicker() {
    Keyboard.dismiss()
    setIsTimePickerVisible(true)
  }

  function setTime(jsDate) {
    const time = moment(jsDate).format('HH:mm')

    save(time, 'time')
    setIsTimePickerVisible(false)
  }

  const { time } = data

  const inputStyle = { color: Colors.greyDark }
  const outOfRangeWarning = getTemperatureOutOfRangeMessage(temperature)

  return (
    <React.Fragment>
      <Segment>
        <AppText style={styles.title}>
          {t('cycleDay.temperature.description')}
        </AppText>
        <View style={styles.container}>
          <AppTextInput
            value={temperature}
            onChangeText={onChangeTemperature}
            keyboardType="numeric"
            maxLength={5}
            style={inputStyle}
            testID="temperatureInput"
            underlineColorAndroid="transparent"
          />
          <AppText>°C</AppText>
        </View>
        {!!outOfRangeWarning && (
          <View style={styles.hintContainer}>
            <AppText style={styles.hint}>{outOfRangeWarning}</AppText>
          </View>
        )}
      </Segment>
      <Segment>
        <AppText style={styles.title}>{t('cycleDay.temperature.time')}</AppText>
        <AppTextInput
          onFocus={onShowTimePicker}
          testID="timeInput"
          value={time}
        />
        <DateTimePicker
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={setTime}
          onCancel={() => setIsTimePickerVisible(false)}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      </Segment>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Containers.rowContainer,
  },
  hint: {
    fontStyle: 'italic',
    fontSize: Sizes.small,
    color: Colors.orange,
  },
  hintContainer: {
    marginVertical: Spacing.tiny,
  },
  title: {
    fontSize: Sizes.subtitle,
  },
})

Temperature.propTypes = {
  data: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
}

export default Temperature
