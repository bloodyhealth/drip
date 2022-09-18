import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, Linking } from 'react-native'

import { Colors, Typography } from '../../styles'

const AppLink = ({ children, link, ...props }) => {
  return (
    <Text style={styles.link} {...props} onPress={() => Linking.openURL(link)}>
      {children}
    </Text>
  )
}

AppLink.propTypes = {
  children: PropTypes.node,
  link: PropTypes.string,
}

const styles = StyleSheet.create({
  link: {
    ...Typography.mainText,
    color: Colors.purple,
    textDecorationLine: 'underline',
  },
})

export default AppLink
