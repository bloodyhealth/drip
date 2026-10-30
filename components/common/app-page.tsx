import React, { PropsWithChildren } from 'react'
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import AppText from '../common/app-text'

import { Colors, Containers, Typography } from '../../styles'

type Props = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>
  scrollViewStyle?: StyleProp<ViewStyle>
  title?: string
}>
const AppPage = ({
  children,
  contentContainerStyle,
  scrollViewStyle,
  title,
}: Props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollView, contentContainerStyle]}
        style={scrollViewStyle}
      >
        {Boolean(title) && <AppText style={styles.title}>{title}</AppText>}
        {children}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { ...Containers.pageContainer },
  scrollView: {
    backgroundColor: Colors.turquoiseLight,
    flexGrow: 1,
  },
  title: {
    ...Typography.title,
  },
})

export default AppPage
