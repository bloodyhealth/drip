import AsyncStorage from '@react-native-async-storage/async-storage'
import Observable from 'obv'
import { TEMP_SCALE_MIN, TEMP_SCALE_MAX, TEMP_SCALE_UNITS } from './config'

export const scaleObservable = Observable()
setObvWithInitValue('tempScale', scaleObservable, {
  min: TEMP_SCALE_MIN,
  max: TEMP_SCALE_MAX,
})

export const unitObservable = Observable()
unitObservable.set(TEMP_SCALE_UNITS)
scaleObservable((scale) => {
  const scaleRange = scale.max - scale.min
  if (scaleRange <= 1.5) {
    unitObservable.set(0.1)
  } else {
    unitObservable.set(0.5)
  }
})

export async function saveTempScale(scale) {
  await AsyncStorage.setItem('tempScale', JSON.stringify(scale))
  scaleObservable.set(scale)
}

export const tempReminderObservable = Observable()
setObvWithInitValue('tempReminder', tempReminderObservable, {
  enabled: false,
})

export async function saveTempReminder(reminder) {
  await AsyncStorage.setItem('tempReminder', JSON.stringify(reminder))
  tempReminderObservable.set(reminder)
}

export const periodReminderObservable = Observable()
setObvWithInitValue('periodReminder', periodReminderObservable, {
  enabled: false,
})

export async function savePeriodReminder(reminder) {
  await AsyncStorage.setItem('periodReminder', JSON.stringify(reminder))
  periodReminderObservable.set(reminder)
}

export const useCervixObservable = Observable()
setObvWithInitValue('useCervix', useCervixObservable, false)

export async function saveUseCervix(bool) {
  await AsyncStorage.setItem('useCervix', JSON.stringify(bool))
  useCervixObservable.set(bool)
}

export const hasEncryptionObservable = Observable()
setObvWithInitValue('hasEncryption', hasEncryptionObservable, false)

export async function saveEncryptionFlag(bool) {
  await AsyncStorage.setItem('hasEncryption', JSON.stringify(bool))
  hasEncryptionObservable.set(bool)
}

export async function getLicenseFlag() {
  return AsyncStorage.getItem('agreedToLicense')
}

export async function saveLicenseFlag() {
  await AsyncStorage.setItem('agreedToLicense', JSON.stringify(true))
}

export async function getChartFlag() {
  const isFirstChartView = await AsyncStorage.getItem('isFirstChartView')
  return isFirstChartView === null ? 'true' : isFirstChartView
}

export async function setChartFlag() {
  await AsyncStorage.setItem('isFirstChartView', JSON.stringify(false))
}

async function setObvWithInitValue(key, obv, defaultValue) {
  const result = await AsyncStorage.getItem(key)
  let value
  if (result) {
    value = JSON.parse(result)
  } else {
    value = defaultValue
  }
  obv.set(value)
}
