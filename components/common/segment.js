import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

import AppText from './app-text'

import { Colors, Containers, Spacing, Typography } from '../../styles'

const Segment = ({ children, last, title }) => {
  const containerStyle = last ? styles.containerLast : styles.container
  const commonStyle = Object.assign({}, containerStyle)

  return (
    <View style={commonStyle}>
      {title && <AppText style={styles.title}>{title}</AppText>}
      {children}
    </View>
  )
}

Segment.propTypes = {
  children: PropTypes.node,
  last: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
}

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
    paddingBottom: Spacing.base,
    ...Containers.segmentContainer,
  },
  containerLast: {
    ...Containers.segmentContainer,
  },
  title: {
    ...Typography.subtitle,
  },
})

export default Segment
