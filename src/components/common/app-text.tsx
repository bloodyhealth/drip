import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

import { Colors, Typography } from '../../styles'

export const AppText = ({ children, style, ...props }: TextProps) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    color: Colors.greyDark,
    ...Typography.mainText,
  },
})
