import notifee, { TriggerType } from '@notifee/react-native'

export function handleNotificationPress(detail, { setDate, setCurrentPage }) {
  const screen = detail.notification?.data?.screen
  const date = new Date().toISOString().split('T')[0]
  setDate(date)

  if (screen === 'TemperatureEditView') {
    setCurrentPage('TemperatureEditView')
  } else {
    setCurrentPage('Home')
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
