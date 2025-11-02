import React, { useState } from 'react'
import PropTypes from 'prop-types'

import AppPage from '../common/app-page'
import MenuItem from './menu-item'

import { useTranslation } from 'react-i18next'
import Button from '../common/button'

const menuItems = [
  { label: 'customization', componentName: 'Customization' },
  { label: 'reminders', componentName: 'Reminders' },
  { label: 'dataManagement', componentName: 'DataManagement' },
  { label: 'password', componentName: 'Password' },
  // this language switch will be released later and is therefore commented out
  // { label: 'language', componentName: 'Language' },
]

const SettingsMenu = ({ navigate }) => {
  const { t } = useTranslation()

  const [hasError, setHasError] = useState(false)

  if (hasError) {
    throw new Error('Oh no! The app crashed')
  }

  const triggerCrash = () => {
    setHasError(true)
  }
  return (
    <AppPage title={t('sideMenu.settings.title')}>
      {menuItems.map((menuItem, i) => {
        const last = menuItems.length === i + 1

        return (
          <MenuItem item={menuItem} key={i} last={last} navigate={navigate} />
        )
      })}
      <Button isCTA onPress={triggerCrash}>
        Crash app
      </Button>
    </AppPage>
  )
}

SettingsMenu.propTypes = {
  navigate: PropTypes.func.isRequired,
}

export default SettingsMenu
