import notifee, { TriggerType } from '@notifee/react-native'

export function handleNotificationPress(detail, handlers) {
  const screen = detail.notification?.data?.screen

  if (screen === 'TemperatureEditView') {
    handlers.setDate(new Date().toISOString().split('T')[0])
    handlers.setCurrentPage('TemperatureEditView')
  } else {
    handlers.setDate(new Date().toISOString().split('T')[0])
    handlers.setCurrentPage('Home')
  }
}

export async function sendBaseNotification(notificationValue, timestamp) {
  if (!timestamp) return

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp,
  }

  try {
    await notifee.createTriggerNotification(notificationValue, trigger)
  } catch (error) {
    console.error('Error sending base notification:', error)
  }
}
