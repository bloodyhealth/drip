import React from 'react'
import { useTranslation } from 'react-i18next'

import AppPage from '../common/app-page'
import SettingsMenuItem from './SettingsMenuItem'

const componentMapper = () => ({
  reminders: 'Reminders',
  nfpSettings: 'NfpSettings',
  dataManagement: 'DataManagement',
  password: 'Password',
})

const SettingsMenu = () => {
  const { t } = useTranslation()

  const menu = ['reminders', 'nfpSettings', 'dataManagement', 'password'].map(
    (setting) => ({
      title: t(`settings.menuItems.${setting}.title`),
      text: t(`settings.menuItems.${setting}.text`),
      component: componentMapper()[setting],
    })
  )

  return (
    <AppPage title={t('settings.title')}>
      {menu.map((menuItem, i) => {
        const last = menu.length === i + 1

        return <SettingsMenuItem item={menuItem} key={i} last={last} />
      })}
    </AppPage>
  )
}

export default SettingsMenu
