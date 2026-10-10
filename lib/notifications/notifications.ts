import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  RepeatFrequency,
  TriggerType,
} from 'react-native-notify-kit'
import { Colors } from '../../styles'
import { ReminderId } from './types'

export interface ReminderContent {
  title: string
  body: string
  channelName: string
  importance: AndroidImportance
}

const isAuthorized = async (): Promise<boolean> => {
  const { authorizationStatus } = await notifee.getNotificationSettings()
  return authorizationStatus >= AuthorizationStatus.AUTHORIZED
}

export const requestPermission = async (): Promise<boolean> => {
  if (await isAuthorized()) return true

  const { authorizationStatus } = await notifee.requestPermission()
  return authorizationStatus >= AuthorizationStatus.AUTHORIZED
}

export const scheduleReminder = async (
  id: ReminderId,
  { title, body, channelName, importance }: ReminderContent,
  timestamp: number,
  repeatFrequency?: RepeatFrequency
): Promise<void> => {
  if (!(await isAuthorized())) return

  const channelId = await notifee.createChannel({
    id,
    name: channelName,
    importance,
  })

  await notifee.createTriggerNotification(
    {
      id,
      title,
      body,
      android: {
        channelId,
        pressAction: { id: 'default', launchActivity: 'default' },
        smallIcon: 'ic_notification',
        color: Colors.purple,
        lightUpScreen: true,
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp,
      ...(repeatFrequency && { repeatFrequency }),
    }
  )
}

export const cancelReminder = (id: ReminderId): Promise<void> =>
  notifee.cancelNotification(id)
