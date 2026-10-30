import React, { ReactNode } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import Logo from './logo'
import HamburgerMenu from './hamburger-menu'

import { Colors, Containers, Sizes } from '../../styles'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const HeaderBar = ({ children }: { children: ReactNode }) => {
  const { top } = useSafeAreaInsets()
  return (
    <View style={[styles.header, { paddingTop: Sizes.base + top }]}>
      {children}
    </View>
  )
}

/** Header without navigation, for screens shown before the app is unlocked. */
export const StaticHeader = () => (
  <HeaderBar>
    <Logo />
  </HeaderBar>
)

export const Header = () => {
  const { navigate } = useNavigation()

  return (
    <HeaderBar>
      <TouchableOpacity
        onPress={() => navigate('Home', undefined, { pop: true })}
      >
        <Logo />
      </TouchableOpacity>
      <HamburgerMenu />
    </HeaderBar>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.purple,
    padding: Sizes.base,
    ...Containers.rowContainer,
  },
})
