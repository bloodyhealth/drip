import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import AppText from '../common/app-text'

import { connect } from 'react-redux'
import { navigate } from '../../slices/navigation'

import { Typography } from '../../styles'

const HeaderMenuItem = ({ item, navigate, closeMenu }) => {
  const { component, title } = item
  const onPress = () => {
    closeMenu()
    navigate(component)
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <AppText style={styles.text}>{title}</AppText>
    </TouchableOpacity>
  )
}

HeaderMenuItem.propTypes = {
  item: PropTypes.shape({
    component: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  text: {
    ...Typography.subtitle,
  },
})

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (page) => dispatch(navigate(page)),
  }
}

export default connect(null, mapDispatchToProps)(HeaderMenuItem)
