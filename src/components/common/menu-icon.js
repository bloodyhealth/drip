import React from 'react'
import PropTypes from 'prop-types'
import createIconSet from '@react-native-vector-icons/icomoon'
import iconConfig from '../../assets/icons/selection.json'

import { Colors, Sizes } from '../../styles'

const Icon = createIconSet(iconConfig, { fontFileName: 'Menu.ttf' })

const MenuIcon = ({ isActive, name }) => {
  const color = isActive ? Colors.greyDark : Colors.grey

  return <Icon name={name} size={Sizes.icon} color={color} />
}

MenuIcon.propTypes = {
  isActive: PropTypes.bool,
  name: PropTypes.string.isRequired,
}

export default MenuIcon
