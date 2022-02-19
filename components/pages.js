import settingsViews from './settings'

export const isSettingsView = (page) =>
  Object.keys(settingsViews).includes(page)

export const pages = [
  {
    component: 'Home',
    icon: 'home',
    label: 'home',
  },
  {
    component: 'Calendar',
    icon: 'calendar',
    isInMenu: true,
    label: 'calendar',
    parent: 'Home',
  },
  {
    component: 'Chart',
    icon: 'chart',
    isInMenu: true,
    label: 'chart',
    parent: 'Home',
  },
  {
    component: 'Stats',
    icon: 'statistics',
    isInMenu: true,
    label: 'stats',
    parent: 'Home',
  },
  {
    children: Object.keys(settingsViews),
    component: 'SettingsMenu',
    icon: 'settings',
    label: 'settings',
    parent: 'Home',
  },
  {
    component: 'Reminders',
    label: 'reminders',
    parent: 'SettingsMenu',
  },
  {
    component: 'NfpSettings',
    label: 'nfpSettings',
    parent: 'SettingsMenu',
  },
  {
    component: 'DataManagement',
    label: 'dataManagement',
    parent: 'SettingsMenu',
  },
  {
    component: 'Password',
    label: 'password',
    parent: 'SettingsMenu',
  },
  {
    component: 'About',
    label: 'about',
    parent: 'SettingsMenu',
  },
  {
    component: 'License',
    label: 'license',
    parent: 'SettingsMenu',
  },
  {
    component: 'CycleDay',
    label: 'cycleDay',
    parent: 'Home',
  },
]
