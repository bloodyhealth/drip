import React, { useState } from 'react'
import PropTypes from 'prop-types'

import AppPage from '../common/app-page'
import Button from '../common/button'
import MenuItem from './menu-item'

import { useTranslation } from 'react-i18next'

const menuItems = [
  { label: 'customization', componentName: 'Customization' },
  { label: 'reminders', componentName: 'Reminders' },
  { label: 'dataManagement', componentName: 'DataManagement' },
  { label: 'password', componentName: 'Password' },
  { label: 'language', componentName: 'Language' },
]

const ThrowTestErrorButton = () => {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) throw new Error('Test error from settings')

  return <Button onPress={() => setShouldThrow(true)}>Throw test error</Button>
}

const SettingsMenu = ({ navigate }) => {
  const { t } = useTranslation()
  return (
    <AppPage title={t('sideMenu.settings.title')}>
      {menuItems.map((menuItem, i) => {
        const last = menuItems.length === i + 1

        return (
          <MenuItem item={menuItem} key={i} last={last} navigate={navigate} />
        )
      })}
      {__DEV__ && <ThrowTestErrorButton />}
    </AppPage>
  )
}

SettingsMenu.propTypes = {
  navigate: PropTypes.func.isRequired,
}

export default SettingsMenu
