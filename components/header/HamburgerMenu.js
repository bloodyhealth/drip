import React, { useState } from 'react'
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { useTranslation } from 'react-i18next'

import AppIcon from '../common/app-icon'
import CloseIcon from '../common/close-icon'
import HeaderMenuItem from './HeaderMenuItem'

import { Colors, Sizes } from '../../styles'
import { HIT_SLOP } from '../../config'

function HamburgerMenu() {
  const { t } = useTranslation()
  const [shouldShowMenu, setShouldShowMenu] = useState(false)

  const toggleMenu = () => {
    setShouldShowMenu(!shouldShowMenu)
  }

  const settingsMenuItems = [
    { title: t('settings.menuItems.settings'), component: 'SettingsMenu' },
    { title: t('settings.menuItems.about'), component: 'About' },
    { title: t('settings.menuItems.license'), component: 'License' },
  ]

  return (
    <React.Fragment>
      {!shouldShowMenu && (
        <TouchableOpacity onPress={toggleMenu} hitSlop={HIT_SLOP}>
          <AppIcon name="dots-three-vertical" color={Colors.orange} />
        </TouchableOpacity>
      )}
      {shouldShowMenu && (
        <Modal
          animationType="fade"
          onRequestClose={toggleMenu}
          transparent={true}
          visible={shouldShowMenu}
        >
          <TouchableOpacity
            onPress={toggleMenu}
            style={styles.blackBackground}
          ></TouchableOpacity>
          <View style={styles.menu}>
            <View style={styles.iconContainer}>
              <CloseIcon color={'black'} onClose={toggleMenu} />
            </View>
            {settingsMenuItems.map((item) => (
              <HeaderMenuItem
                item={item}
                key={item.title}
                closeMenu={toggleMenu}
              />
            ))}
          </View>
        </Modal>
      )}
    </React.Fragment>
  )
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

export default HamburgerMenu
