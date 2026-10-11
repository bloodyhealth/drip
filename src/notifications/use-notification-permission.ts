import { useCallback, useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { isAuthorized, requestPermission } from './notifications'

export interface NotificationPermission {
  isGranted: boolean | undefined
  request: () => Promise<boolean>
}

export const useNotificationPermission = (): NotificationPermission => {
  const [isGranted, setIsGranted] = useState<boolean>()

  useEffect(() => {
    const check = (): void => {
      isAuthorized().then(setIsGranted).catch(console.error)
    }

    check()
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') check()
    })

    return () => subscription.remove()
  }, [])

  const request = useCallback(async (): Promise<boolean> => {
    const granted = await requestPermission()
    setIsGranted(granted)
    return granted
  }, [])

  return { isGranted, request }
}
