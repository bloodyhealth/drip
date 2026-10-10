import type { TFunction } from 'i18next'
import { useEffect, useRef } from 'react'

import {
  periodReminderObservable,
  tempReminderObservable,
} from '../../../local-storage'
import { useNotificationPermission } from '../../../lib/notifications/use-notification-permission'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { openNotificationSettings } from '../../../lib/notifications/notifications'

export const usePermissionDialog = (): (() => Promise<boolean>) => {
  const { isGranted, request } = useNotificationPermission()
  const hasCheckedOnOpen = useRef(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (isGranted === undefined || hasCheckedOnOpen.current) return

    hasCheckedOnOpen.current = true
    if (!isGranted && isAnyReminderEnabled()) showPermissionDialog(t)
  }, [isGranted, t])

  const requestPermission = async (): Promise<boolean> => {
    const granted = await request()
    if (!granted) showPermissionDialog(t)
    return granted
  }

  return requestPermission
}

const isAnyReminderEnabled = (): boolean =>
  Boolean(
    periodReminderObservable.value?.enabled ||
      tempReminderObservable.value?.enabled
  )

function showPermissionDialog(t: TFunction): void {
  const translationKey = 'sideMenu.settings.reminders.permissionDialog'

  Alert.alert(t(`${translationKey}.title`), t(`${translationKey}.text`), [
    { text: t('shared.cancel'), style: 'cancel' },
    {
      text: t(`${translationKey}.openSettings`),
      onPress: openNotificationSettings,
    },
  ])
}
