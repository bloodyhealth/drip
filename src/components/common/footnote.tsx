import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import AppText from '../common/app-text'
import Asterisk from './asterisk'

import { Colors, Spacing } from '../../styles'

type ColorLabel = {
  [K in keyof typeof Colors]: (typeof Colors)[K] extends string ? K : never
}[keyof typeof Colors]

interface FootnoteProps {
  children?: ReactNode
  colorLabel?: ColorLabel
}

const Footnote = ({ children, colorLabel = 'greyDark' }: FootnoteProps) => {
  if (!children) return false

  return (
    <View style={styles.container}>
      <Asterisk />
      <AppText
        linkStyle={styles.link}
        style={{ ...styles.text, color: Colors[colorLabel] }}
      >
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
  link: {
    color: 'white',
  },
  text: {
    paddingLeft: Spacing.small,
  },
})

export default Footnote
