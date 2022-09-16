import React from 'react'
import PropTypes from 'prop-types'

import AppPage from '../common/app-page'
import MenuItem from './menu-item'

import settingsLabels from '../../i18n/en/settings'

const menuItems = [
  { label: 'reminders', componentName: 'Reminders' },
  { label: 'nfpSettings', componentName: 'NfpSettings' },
  { label: 'dataManagement', componentName: 'DataManagement' },
  { label: 'password', componentName: 'Password' },
]

const SettingsMenu = ({ navigate }) => {
  return (
    <AppPage title={settingsLabels.title}>
      {menuItems.map((menuItem, i) => {
        const last = menuItems.length === i + 1

        return (
          <MenuItem item={menuItem} key={i} last={last} navigate={navigate} />
        )
      })}
    </AppPage>
  )
}

SettingsMenu.propTypes = {
  navigate: PropTypes.func.isRequired,
}

export default SettingsMenu
