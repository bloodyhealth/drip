import { LocalDate } from '@js-joda/core'
import notifee, { EventType, type Notification } from 'react-native-notify-kit'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { refreshReminders, setupReminders } from './setup-reminders'
import { ReminderId } from './types'
import { useNotificationPermission } from './use-notification-permission'
import {
  navigateWhenReady,
  navigationRef,
} from '@/context/navigation/navigation-ref'

export const useNotifications = (): void => {
  const { isGranted } = useNotificationPermission()

  useEffect(() => setupReminders(), [])

  useEffect(() => {
    if (isGranted) refreshReminders()
  }, [isGranted])

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) {
        openReminderScreen(detail.notification)
      }
    })

    openInitialNotification().catch(console.error)

    return unsubscribe
  }, [])
}

const openReminderScreen = ({ id }: Notification): void => {
  navigateWhenReady(() => {
    if ((id as ReminderId) === 'temperature') {
      const date = LocalDate.now().toString()
      // goes back to a cycle day already in the stack instead of adding one
      navigationRef.navigate(
        'CycleDay',
        { date, isTemperatureEditView: true },
        { pop: true }
      )
    } else {
      navigationRef.navigate('Home', undefined, { pop: true })
    }
  })
}

const openInitialNotification = async (): Promise<void> => {
  // iOS fires an onForegroundEvent instead
  if (Platform.OS === 'ios') return

  const initial = await notifee.getInitialNotification()
  if (initial?.pressAction !== undefined)
    openReminderScreen(initial.notification)
}
