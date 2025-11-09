import i18n from '../../i18n/i18n'
import { AndroidImportance } from '@notifee/react-native'

export const NOTIFICATION_TYPE = {
  PERIOD: 'PERIOD',
  TEMPERATURE: 'TEMPERATURE',
}

export const CHANNELS = {
  [NOTIFICATION_TYPE.TEMPERATURE]: {
    id: 'temperature_reminder',
    name: i18n.t('sideMenu.settings.reminders.temperatureReminder.name'),
    importance: AndroidImportance.HIGH,
  },
  [NOTIFICATION_TYPE.PERIOD]: {
    id: 'period_reminder',
    name: i18n.t('sideMenu.settings.reminders.periodReminder.name'),
  },
}

export const ANDROID_BACKGROUND_RESTRICTIONS = {
  BATTERY_OPTIMIZATION: 'batteryOptimization',
  POWER_MANAGER: 'powerManager',
}

export const ANDROID = 'android'

export const ALERT_ACTIONS = {
  CANCELLED: 'cancelled',
  OPENED_SETTINGS: 'openedSettings',
}
