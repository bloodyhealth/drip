import React from 'react'

import AppPage from '../common/app-page'
import MenuItem from './menu-item'

import { useTranslation } from 'react-i18next'

const menuItems = [
  { label: 'customization', componentName: 'Customization' },
  { label: 'reminders', componentName: 'Reminders' },
  { label: 'dataManagement', componentName: 'DataManagement' },
  { label: 'password', componentName: 'Password' },
  { label: 'language', componentName: 'Language' },
]

const SettingsMenu = () => {
  const { t } = useTranslation()
  return (
    <AppPage title={t('sideMenu.settings.title')}>
      {menuItems.map((menuItem, i) => {
        const last = menuItems.length === i + 1

        return <MenuItem item={menuItem} key={i} last={last} />
      })}
    </AppPage>
  )
}

export default SettingsMenu
