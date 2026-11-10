import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

import { AppText } from './app-text'

import { Colors, Containers, Spacing, Typography } from '../../styles'

type SegmentProps = PropsWithChildren<{
  last?: boolean
  title?: string
  subheader?: string
}>

export const Segment = ({
  children,
  last = false,
  title,
  subheader,
}: SegmentProps) => {
  const containerStyle = last ? styles.containerLast : styles.container

  return (
    <View style={containerStyle}>
      {title && <AppText style={styles.title}>{title}</AppText>}
      {subheader && <AppText style={styles.subheader}>{subheader}</AppText>}
      {children}
    </View>
  )
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
  subheader: {
    ...Typography.subtitle,
    fontWeight: 'bold',
    marginBottom: 0,
  },
})
