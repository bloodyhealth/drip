import React from 'react'
import PropTypes from 'prop-types'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'

import AppText from '../common/app-text'

import { Colors, Containers } from '../../styles'
import { useTranslation } from 'react-i18next'

export default function SelectTabGroup({
  activeButton,
  buttons,
  onSelect,
  disabled,
}) {
  const { t } = useTranslation()
  // TODO https://gitlab.com/bloodyhealth/drip/-/issues/707
  const oneTimeTransformIntoNumber =
    typeof activeButton === 'boolean' && Number(activeButton)
  const isSecondarySymptomSwitch = buttons[0]['label'] === t('symptoms.mucus')

  // Disable is only used for secondarySymptom in customization, if more come up maybe consider more tidy solution
  const showDisabledAlert = (label) => {
    if (label === t('symptoms.cervix') || label === t('symptoms.mucus')) {
      Alert.alert(
        t('sideMenu.settings.customization.secondarySymptom.alert.title'),
        t(
          'sideMenu.settings.customization.secondarySymptom.alert.textFertilityTrackingDisabled'
        )
      )
    }
  }

  return (
    <View style={styles.container}>
      {buttons.map(({ label, value }, i) => {
        const isActive =
          value === activeButton || value === oneTimeTransformIntoNumber
        const boxStyle = [
          styles.box,
          isActive && styles.boxActive,
          isSecondarySymptomSwitch && styles.purpleBox,
          isSecondarySymptomSwitch && isActive && styles.activePurpleBox,
          disabled && styles.disabledBox,
        ]
        const textStyle = [
          styles.text,
          isSecondarySymptomSwitch && styles.purpleText,
          isActive && styles.textActive,
          disabled && styles.greyText,
        ]

        return (
          <TouchableOpacity
            onPress={() =>
              !disabled ? onSelect(value) : showDisabledAlert(label)
            }
            key={i}
            style={boxStyle}
          >
            <AppText style={textStyle}>{label}</AppText>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

SelectTabGroup.propTypes = {
  activeButton: PropTypes.number,
  buttons: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

const styles = StyleSheet.create({
  box: {
    ...Containers.box,
  },
  boxActive: {
    ...Containers.boxActive,
  },
  container: {
    ...Containers.selectGroupContainer,
  },
  text: {
    color: Colors.orange,
  },
  textActive: {
    color: 'white',
  },
  purpleBox: {
    borderColor: Colors.purple,
  },
  activePurpleBox: {
    backgroundColor: Colors.purple,
  },
  purpleText: {
    color: Colors.purple,
  },
  greyText: {
    color: Colors.grey,
  },
  disabledBox: {
    borderColor: Colors.grey,
    backgroundColor: Colors.turquoiseLight,
  },
})
