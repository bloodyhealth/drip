import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import MenuItem from './menu-item'

import { Containers } from '../../styles'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

const MENU_ITEMS = [
  { name: 'Calendar', icon: 'calendar', labelKey: 'calendar' },
  { name: 'Chart', icon: 'chart', labelKey: 'chart' },
  { name: 'Stats', icon: 'statistics', labelKey: 'stats' },
]

const Menu = ({ currentPage }) => {
  const { navigate } = useNavigation()

  const { t } = useTranslation(null, { keyPrefix: 'bottomMenu' })

  return (
    <View style={styles.container}>
      {MENU_ITEMS.map(({ icon, labelKey, name }) => {
        return (
          <MenuItem
            isActive={name === currentPage}
            onPress={() => navigate(name, undefined, { pop: true })}
            icon={icon}
            key={labelKey}
            label={t(labelKey)}
          />
        )
      })}
    </View>
  )
}

Menu.propTypes = {
  currentPage: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    ...Containers.rowContainer,
  },
})

export default Menu
