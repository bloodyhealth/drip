export function handleNotificationPress(detail: any, handlers) {
  const screen = detail.notification?.data?.screen
  if (screen === 'TemperatureEditView') {
    handlers.setDate(new Date().toISOString().split('T')[0])
    handlers.setCurrentPage('TemperatureEditView')
  }
}
