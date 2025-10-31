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
