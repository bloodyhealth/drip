import { LocalDate } from '@js-joda/core'
import notifee, { EventType, type Notification } from 'react-native-notify-kit'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { refreshReminders, setupReminders } from './setup-reminders'
import { NavigationActions, ReminderId } from './types'
import { useNotificationPermission } from './use-notification-permission'

const openReminderScreen = (
  { id }: Notification,
  { setDate, setCurrentPage }: NavigationActions
): void => {
  if ((id as ReminderId) === 'temperature') {
    setDate(LocalDate.now().toString())
    setCurrentPage('TemperatureEditView')
  } else {
    setCurrentPage('Home')
  }
}

const openInitialNotification = async (
  actions: NavigationActions
): Promise<void> => {
  // iOS fires an onForegroundEvent instead
  if (Platform.OS === 'ios') return

  const initial = await notifee.getInitialNotification()
  if (initial?.pressAction !== undefined)
    openReminderScreen(initial.notification, actions)
}

export const useNotifications = ({
  setDate,
  setCurrentPage,
}: NavigationActions): void => {
  const { isGranted } = useNotificationPermission()

  useEffect(() => setupReminders(), [])

  useEffect(() => {
    if (isGranted) refreshReminders()
  }, [isGranted])

  useEffect(() => {
    const actions = { setDate, setCurrentPage }
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) {
        openReminderScreen(detail.notification, actions)
      }
    })

    openInitialNotification(actions).catch(console.error)

    return unsubscribe
  }, [setDate, setCurrentPage])
}
