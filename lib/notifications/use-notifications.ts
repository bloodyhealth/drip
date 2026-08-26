import { useCallback, useEffect } from 'react'
import notifee, { EventType, type Notification } from '@notifee/react-native'
import NotificationService from './notification-service'
import { setupPeriodNotifications } from './period.ts'
import { setupTemperatureNotifications } from './temperature.ts'
import { Platform } from 'react-native'
import { NavigationActions, NotificationData } from './types'
import { LocalDate } from '@js-joda/core'

/** Convenience hook that wires up both setup and event handling */
export const useNotifications = (actions: NavigationActions): void => {
  useNotificationSetup()
  useNotificationEvents(actions)
}

/**
 * Registers domain-specific notifications
 */
const useNotificationSetup = (): void => {
  useEffect(() => {
    const setup = async (): Promise<void> => {
      const isAuthorized = await NotificationService.requestPermissions()
      if (!isAuthorized) return

      await setupPeriodNotifications()
      await setupTemperatureNotifications()
    }

    setup().catch(console.error)
  }, [])
}

/**
 * Handles foreground notification events only. Refactor to proper navigation to use handle background notification events
 * @param setDate
 * @param setCurrentPage
 */
const useNotificationEvents = ({
  setDate,
  setCurrentPage,
}: NavigationActions): void => {
  const handleNotification = useCallback(
    (type: EventType, notification: Notification): void => {
      if (type === EventType.PRESS) {
        handleNotificationPress(notification, { setDate, setCurrentPage })
      }
    },
    [setDate, setCurrentPage]
  )

  const handleInitialNotification = useCallback(async (): Promise<void> => {
    // iOS fires an onForegroundEvent instead, so skip here
    if (Platform.OS === 'ios') return

    const initial = await notifee.getInitialNotification()
    if (initial?.pressAction !== undefined) {
      handleNotification(EventType.PRESS, initial.notification)
    }
  }, [handleNotification])

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const init = async (): Promise<void> => {
      await handleInitialNotification()

      unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
        if (!detail.notification) return
        handleNotification(type, detail.notification)
      })
    }

    init().catch(console.error)

    return () => unsubscribe?.()
  }, [handleInitialNotification, handleNotification])
}

const handleNotificationPress = (
  notification: Notification,
  { setDate, setCurrentPage }: NavigationActions
): void => {
  const { screen } = notification.data as NotificationData
  if (screen === 'TemperatureEditView') {
    setDate(LocalDate.now().toString())
    setCurrentPage('TemperatureEditView')
  } else {
    setCurrentPage('Home')
  }
}
