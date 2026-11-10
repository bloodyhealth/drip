import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { AppText } from './app-text'
import Asterisk from './asterisk'

import { Colors, Spacing } from '../../styles'

interface FootnoteProps {
  children?: ReactNode
  color?: 'dark' | 'light'
}

const Footnote = ({ children, color = 'dark' }: FootnoteProps) => {
  if (!children) return false

  return (
    <View style={styles.container}>
      <Asterisk />
      <AppText style={[styles.text, color === 'light' && styles.textLight]}>
        {children}
      </AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    marginBottom: Spacing.tiny,
    marginTop: Spacing.base,
  },
  text: {
    color: Colors.greyDark,
    paddingLeft: Spacing.small,
  },
  textLight: {
    color: Colors.greyLight,
  },
})

export default Footnote
