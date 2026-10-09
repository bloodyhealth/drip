import AsyncStorage from '@react-native-async-storage/async-storage'
// @ts-expect-error
import Observable from 'obv'
import {
  ADVANCE_PERIOD_NOTICE_DAYS_INIT_VALUE,
  TEMP_SCALE_MAX,
  TEMP_SCALE_MIN,
  TEMP_SCALE_UNITS,
} from './config'
import { isLanguage, Language } from './i18n/constants'
import { PeriodReminder, TemperatureReminder } from './lib/notifications/types'

type Scale = { min: number; max: number }

export type TrackingCategory =
  | 'temperature'
  | 'mucus'
  | 'cervix'
  | 'sex'
  | 'desire'
  | 'pain'
  | 'mood'
  | 'note'

export const scaleObservable = Observable()
setObvWithInitValue('tempScale', scaleObservable, {
  min: TEMP_SCALE_MIN,
  max: TEMP_SCALE_MAX,
})

export const unitObservable = Observable()
unitObservable.set(TEMP_SCALE_UNITS)
scaleObservable((scale: Scale) => {
  const scaleRange = scale.max - scale.min
  if (scaleRange <= 1.5) {
    unitObservable.set(0.1)
  } else {
    unitObservable.set(0.5)
  }
})

export async function saveTempScale(scale: Scale): Promise<void> {
  await AsyncStorage.setItem('tempScale', JSON.stringify(scale))
  scaleObservable.set(scale)
}

export const tempReminderObservable = Observable()
setObvWithInitValue('tempReminder', tempReminderObservable, {
  enabled: false,
})

export async function saveTempReminder(
  reminder: TemperatureReminder
): Promise<void> {
  await AsyncStorage.setItem('tempReminder', JSON.stringify(reminder))
  tempReminderObservable.set(reminder)
}

export const periodReminderObservable = Observable()
setObvWithInitValue('periodReminder', periodReminderObservable, {
  enabled: false,
})

export async function savePeriodReminder(
  reminder: PeriodReminder
): Promise<void> {
  await AsyncStorage.setItem('periodReminder', JSON.stringify(reminder))
  periodReminderObservable.set(reminder)
}

export const periodPredictionObservable = Observable()
setObvWithInitValue('periodPrediction', periodPredictionObservable, true)

export async function savePeriodPrediction(
  periodPrediction: boolean
): Promise<void> {
  await AsyncStorage.setItem(
    'periodPrediction',
    JSON.stringify(periodPrediction)
  )
  periodPredictionObservable.set(periodPrediction)

  if (!periodPredictionObservable.value) {
    periodReminderObservable.set(false)
  }
}

export const advanceNoticeDaysObservable = Observable()
setObvWithInitValue(
  'advanceNoticeDays',
  advanceNoticeDaysObservable,
  ADVANCE_PERIOD_NOTICE_DAYS_INIT_VALUE
)

export async function saveAdvanceNoticeDays(days: number[]): Promise<void> {
  await AsyncStorage.setItem('advanceNoticeDays', JSON.stringify(days))
  advanceNoticeDaysObservable.set(days)
}

export const useCervixAsSecondarySymptomObservable = Observable()
setObvWithInitValue(
  'useCervixAsSecondarySymptom',
  useCervixAsSecondarySymptomObservable,
  0
)

export async function saveUseCervixAsSecondarySymptom(
  value: number
): Promise<void> {
  await AsyncStorage.setItem(
    'useCervixAsSecondarySymptom',
    JSON.stringify(value)
  )
  useCervixAsSecondarySymptomObservable.set(value)
}

export const hasEncryptionObservable = Observable()
setObvWithInitValue('hasEncryption', hasEncryptionObservable, false)

export async function saveEncryptionFlag(isEncrypted: boolean): Promise<void> {
  await AsyncStorage.setItem('hasEncryption', JSON.stringify(isEncrypted))
  hasEncryptionObservable.set(isEncrypted)
}

export async function getLicenseFlag(): Promise<string | null> {
  return AsyncStorage.getItem('agreedToLicense')
}

export async function saveLicenseFlag(): Promise<void> {
  await AsyncStorage.setItem('agreedToLicense', JSON.stringify(true))
}

export async function getChartFlag(): Promise<string> {
  const isFirstChartView = await AsyncStorage.getItem('isFirstChartView')
  return isFirstChartView === null ? 'true' : isFirstChartView
}

export async function setChartFlag(): Promise<void> {
  await AsyncStorage.setItem('isFirstChartView', JSON.stringify(false))
}

export const temperatureTrackingCategoryObservable = Observable()
setObvWithInitValue('temperature', temperatureTrackingCategoryObservable, true)

export const mucusTrackingCategoryObservable = Observable()
setObvWithInitValue('mucus', mucusTrackingCategoryObservable, true)

export const cervixTrackingCategoryObservable = Observable()
setObvWithInitValue('cervix', cervixTrackingCategoryObservable, true)

export const sexTrackingCategoryObservable = Observable()
setObvWithInitValue('sex', sexTrackingCategoryObservable, true)

export const desireTrackingCategoryObservable = Observable()
setObvWithInitValue('desire', desireTrackingCategoryObservable, true)

export const painTrackingCategoryObservable = Observable()
setObvWithInitValue('pain', painTrackingCategoryObservable, true)

export const moodTrackingCategoryObservable = Observable()
setObvWithInitValue('mood', moodTrackingCategoryObservable, true)

export const noteTrackingCategoryObservable = Observable()
setObvWithInitValue('note', noteTrackingCategoryObservable, true)

const trackingCategoryObservables = {
  temperature: temperatureTrackingCategoryObservable,
  mucus: mucusTrackingCategoryObservable,
  cervix: cervixTrackingCategoryObservable,
  sex: sexTrackingCategoryObservable,
  desire: desireTrackingCategoryObservable,
  pain: painTrackingCategoryObservable,
  mood: moodTrackingCategoryObservable,
  note: noteTrackingCategoryObservable,
} satisfies Record<TrackingCategory, unknown>

export async function saveTrackingCategory(
  category: TrackingCategory,
  isTracking: boolean
): Promise<void> {
  await AsyncStorage.setItem(category, JSON.stringify(isTracking))
  trackingCategoryObservables[category].set(isTracking)

  if (category === 'temperature' && !isTracking) {
    await disableTempReminder()
  }
}

async function disableTempReminder(): Promise<void> {
  const tempReminderResult = await AsyncStorage.getItem('tempReminder')
  if (tempReminderResult && JSON.parse(tempReminderResult).enabled) {
    tempReminderObservable.set(false)
  }
}

export const fertilityTrackingObservable = Observable()
setObvWithInitValue('fertilityTracking', fertilityTrackingObservable, true)

export async function saveFertilityTrackingEnabled(
  isEnabled: boolean
): Promise<void> {
  await AsyncStorage.setItem('fertilityTracking', JSON.stringify(isEnabled))
  fertilityTrackingObservable.set(isEnabled)
}

async function setObvWithInitValue<T>(
  key: string,
  obv: { set(value: T): void },
  defaultValue: T
): Promise<void> {
  const result = await AsyncStorage.getItem(key)
  const value = result ? JSON.parse(result) : defaultValue
  obv.set(value)
}

export async function getLanguage(): Promise<Language> {
  try {
    const storedLanguage = await AsyncStorage.getItem('language')
    return isLanguage(storedLanguage) ? storedLanguage : 'en-US'
  } catch {
    return 'en-US'
  }
}

export async function saveLanguage(selectedLanguage: Language): Promise<void> {
  try {
    await AsyncStorage.setItem('language', selectedLanguage)
  } catch {
    console.error(
      `An error occurred. Tried to store language ${selectedLanguage} in local storage`
    )
  }
}
