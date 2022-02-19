import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import MenuItem from './MenuItem'

import { Containers } from '../../styles'
import { pages } from '../pages'

const Menu = () => {
  const menuItems = pages.filter((page) => page.isInMenu)

  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      {menuItems.map(({ icon, label, component }) => {
        return (
          <MenuItem
            component={component}
            icon={icon}
            key={label}
            label={t(`pages.${label}`)}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    ...Containers.rowContainer,
  },
})

export default Menu
