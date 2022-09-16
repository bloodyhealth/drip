import React, { useState } from 'react'
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import AppIcon from '../common/app-icon'
import CloseIcon from '../common/close-icon'
import MenuItem from './menu-item'

import { Colors, Sizes } from '../../styles'
import { HIT_SLOP } from '../../config'
import { useTranslation } from 'react-i18next'

const settingsMenuItems = [
  { label: 'settings', componentName: 'SettingsMenu' },
  { label: 'about', componentName: 'About' },
  { label: 'license', componentName: 'License' },
  { label: 'privacyPolicy', componentName: 'PrivacyPolicy' },
]

const HamburgerMenu = ({ navigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  const { t } = useTranslation(null, { keyPrefix: 'settings.menuMain' })

  if (!isOpen)
    return (
      <TouchableOpacity onPress={() => setIsOpen(true)} hitSlop={HIT_SLOP}>
        <AppIcon name="dots-three-vertical" color={Colors.orange} />
      </TouchableOpacity>
    )

  return (
    <Modal animationType="fade" onRequestClose={closeMenu} transparent>
      <TouchableOpacity onPress={closeMenu} style={styles.blackBackground} />
      <View style={styles.menu}>
        <View style={styles.iconContainer}>
          <CloseIcon color={'black'} onClose={closeMenu} />
        </View>
        {settingsMenuItems.map((item) => (
          <MenuItem
            componentName={item.componentName}
            label={t(item.label)}
            key={item.name}
            closeMenu={closeMenu}
            navigate={navigate}
          />
        ))}
      </View>
    </Modal>
  )
}

export default HamburgerMenu

HamburgerMenu.propTypes = {
  navigate: PropTypes.func,
}

const styles = StyleSheet.create({
  blackBackground: {
    backgroundColor: 'black',
    flex: 1,
    opacity: 0.65,
  },
  iconContainer: {
    alignSelf: 'flex-end',
    marginBottom: Sizes.base,
  },
  menu: {
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    height: '100%',
    padding: Sizes.base,
    paddingTop: Platform.OS === 'ios' ? Sizes.huge : Sizes.base,
    position: 'absolute',
    width: '60%',
  },
})
