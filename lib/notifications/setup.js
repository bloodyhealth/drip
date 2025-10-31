import notifee from '@notifee/react-native'
import { setupTemperatureNotifications } from './temperature'
import { setupPeriodNotifications } from './period'

export default async function setupNotifications() {
  await notifee.requestPermission()
  await setupPeriodNotifications()
  await setupTemperatureNotifications()
}
