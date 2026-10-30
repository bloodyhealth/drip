import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import Logo from './logo'
import HamburgerMenu from './hamburger-menu'

import { Colors, Containers, Sizes } from '../../styles'

interface StaticHeaderProps {
  isStatic: true
  navigate?: never
}

interface NavigableHeaderProps {
  isStatic?: false
  navigate: (page: string) => void
}

type HeaderProps = StaticHeaderProps | NavigableHeaderProps

const Header = ({ isStatic, navigate }: HeaderProps) => {
  return (
    <View style={styles.header}>
      {isStatic ? (
        <Logo />
      ) : (
        <>
          <TouchableOpacity onPress={() => navigate('Home')}>
            <Logo />
          </TouchableOpacity>
          <HamburgerMenu navigate={navigate} />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.purple,
    padding: Sizes.base,
    ...Containers.rowContainer,
  },
})

export default Header
