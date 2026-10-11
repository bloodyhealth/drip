import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'

import Logo from './logo'
import HamburgerMenu from './hamburger-menu'

import { Colors, Containers, Sizes } from '../../styles'
import { useNavigation } from '@react-navigation/native'

const HeaderBar = ({ children }) => (
  <View style={styles.header}>{children}</View>
)

HeaderBar.propTypes = {
  children: PropTypes.node,
}

/** Header without navigation, for screens shown before the app is unlocked. */
export const StaticHeader = () => (
  <HeaderBar>
    <Logo />
  </HeaderBar>
)

const Header = () => {
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

export default Header
