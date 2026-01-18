import { useCallback, useEffect } from 'react'
import notifee, { EventType } from '@notifee/react-native'
import NotificationService from './notification-service'
import { Platform } from 'react-native'

export const useNotifications = ({ setDate, setCurrentPage }) => {
  const handleNotification = useCallback(
    (type, notification) => {
      if (type === EventType.PRESS) {
        handleNotificationPress(notification, { setDate, setCurrentPage })
      }
    },
    [handleNotificationPress, setDate, setCurrentPage]
  )

  const handleInitialNotification = useCallback(async () => {
    // receive an onForegroundEvent on iOS, thus ignoring the initial notification here
    if (Platform.OS === 'ios') {
      return
    }
    const initialNotification = await notifee.getInitialNotification()

    if (initialNotification?.pressAction !== undefined) {
      handleNotification(EventType.PRESS, initialNotification.notification)
    }
  }, [handleNotification])

  const handleNotificationPress = useCallback(
    (notification, { setDate, setCurrentPage }) => {
      const screen = notification?.data?.screen
      const date = new Date().toISOString().split('T')[0]
      setDate(date)

      if (screen === 'TemperatureEditView') {
        setCurrentPage('TemperatureEditView')
      } else {
        setCurrentPage('Home')
      }
    },
    []
  )

  useEffect(() => {
    let unsubscribe

    const init = async () => {
      await NotificationService.initialize()

      await handleInitialNotification()

      unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
        handleNotification(type, detail.notification)
      })
    }

    init()

    return unsubscribe
  }, [handleInitialNotification, handleNotification])
}
