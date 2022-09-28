import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'

import Logo from './logo'
import HamburgerMenu from './hamburger-menu'

import { Colors, Containers, Sizes } from '../../styles'

const Header = ({ isStatic, navigation }) => {
  return (
    <View style={styles.header}>
      {isStatic ? (
        <Logo />
      ) : (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Logo />
          </TouchableOpacity>
          <HamburgerMenu navigate={navigation.navigate} />
        </>
      )}
    </View>
  )
}

Header.propTypes = {
  isStatic: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
}

Header.defaultProps = {
  isStatic: false,
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.purple,
    padding: Sizes.base,
    ...Containers.rowContainer,
  },
})

export default Header
