import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

import AppText from '../common/app-text'

import { Containers, Spacing, Typography } from '../../styles'

const AppHelp = ({ text }) => (
  <View style={styles.container}>
    <AppText style={styles.accentPurple}>*</AppText>
    <AppText>{text}</AppText>
  </View>
)

AppHelp.propTypes = {
  onClose: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  accentPurple: {
    ...Typography.accentPurple,
    alignSelf: 'flex-start',
    paddingRight: Spacing.base,
  },
  container: {
    ...Containers.rowContainer,
    padding: Spacing.base,
  },
})

export default AppHelp
