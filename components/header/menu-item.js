import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import AppText from '../common/app-text'
import { Typography } from '../../styles'

const MenuItem = ({ componentName, label, navigate, closeMenu }) => {
  const onPress = () => {
    closeMenu()
    navigate(componentName)
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <AppText style={styles.text}>{label}</AppText>
    </TouchableOpacity>
  )
}

MenuItem.propTypes = {
  componentName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  text: {
    ...Typography.subtitle,
  },
})

export default MenuItem
