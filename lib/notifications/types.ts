import { AndroidImportance } from '@notifee/react-native'

export type NavigationActions = {
  setDate: (date: string) => void
  setCurrentPage: (page: string) => void
}

export type TemperatureReminder =
  | { enabled: true; time: string }
  | { enabled: false; time?: string }

export type PeriodReminder = {
  enabled: boolean
}

export type NotificationConfig = {
  id: NotificationType
  title: string
  body: string
  channel: NotificationAndroidChannel
  data: NotificationData
}

export type NotificationType = 'period' | 'temperature'

export type NotificationData = {
  screen: 'Home' | 'TemperatureEditView'
}

type NotificationAndroidChannel = {
  id: NotificationType
  name: string
  importance: AndroidImportance
}
