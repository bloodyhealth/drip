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
