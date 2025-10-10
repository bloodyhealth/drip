import notifee, { AndroidImportance } from '@notifee/react-native'

export const PERIOD_CHANNEL = 'PERIOD'
export const TEMPERATURE_CHANNEL = 'TEMPERATURE'

export const CHANNELS = {
  TEMPERATURE: {
    id: 'temperature_reminder',
    name: 'Temperature Reminders',
    importance: AndroidImportance.HIGH,
  },
  PERIOD: {
    id: 'period_reminder',
    name: 'Period Predictions',
    importance: AndroidImportance.HIGH,
  },
}

export async function cancelNotifications(channel) {
  if (!CHANNELS?.[channel]?.id) return

  try {
    await notifee.cancelNotification(CHANNELS[channel].id)
  } catch (error) {
    console.error('Error canceling notifications:', error)
  }
}

export async function createChannel(channel) {
  if (!CHANNELS?.[channel]?.id) return

  try {
    await notifee.createChannel(CHANNELS[channel])
  } catch (error) {
    console.error('Error creating channel:', error)
  }
}
