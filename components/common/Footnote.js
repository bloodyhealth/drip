import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

import AppText from '../common/app-text'
import Asterisk from '../common/Asterisk'

import { Colors, Spacing } from '../../styles'

const Footnote = ({ light, children }) => {
  if (!children) return false

  const textStyle = light ? styles.lightText : styles.text

  return (
    <View style={styles.container}>
      <Asterisk />
      <AppText linkStyle={styles.link} style={textStyle}>
        {children}
      </AppText>
    </View>
  )
}

Footnote.propTypes = {
  children: PropTypes.node,
  light: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    marginBottom: Spacing.tiny,
    marginTop: Spacing.base,
  },
  lightText: {
    color: Colors.greyLight,
    paddingLeft: Spacing.small,
  },
  link: {
    color: 'white',
  },
  text: {
    paddingLeft: Spacing.small,
  },
})

export default Footnote
