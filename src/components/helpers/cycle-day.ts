import { ChronoUnit, LocalDate, LocalTime } from '@js-joda/core'
import { TFunction } from 'i18next'

import {
  getPreviousTemperatureForDate,
  saveSymptom,
  mapRealmObjToJsObj,
} from '@/db'
import { scaleObservable } from '@/local-storage'

import { getOptions, getOptionsNumeric, SYMPTOMS } from './labels'
import { Symptom, TEMP_MAX, TEMP_MIN } from '@/config'
import i18n from '../../i18n/i18n'

import computeNfpValue from '../../lib/nfp-mucus'

export interface SymptomData {
  exclude?: boolean
  note?: string | null
  other?: boolean | null
  value?: unknown
  [key: string]: unknown
}

export interface TabOption {
  label: string
  value: number
}

export interface TabGroup {
  key: string
  options: TabOption[]
  title: string
}

export interface BoxGroup {
  key: string
  options: Record<string, string>
  title: string
}

export interface SymptomConfig {
  excludeText: string | null
  note: string | null
  selectBoxGroups: BoxGroup[] | null
  selectTabGroups: TabGroup[] | null
}

type SaveSymptomData = (
  data: SymptomData,
  date: string,
  shouldDeleteData: boolean
) => void

type GetSymptomLabel = (data: SymptomData) => string | null | undefined

const minutes = ChronoUnit.MINUTES

const isNumber = (value: unknown): value is number => typeof value === 'number'
export const shouldShow = (value: unknown) => value !== null

export const formatTemperature = (temperature: number | null | undefined) =>
  !temperature
    ? temperature
    : Number.parseFloat(temperature.toString()).toFixed(2)

//maximum of precision digits after decimal point, but no x.0
export const formatDecimal = (num: number | string, precision: number) =>
  +parseFloat(Number.parseFloat(String(num)).toFixed(precision))

export const getPreviousTemperature = (date: string) => {
  const previousTemperature = getPreviousTemperatureForDate(date)
  return formatTemperature(previousTemperature)
}

export const getTemperatureOutOfRangeMessage = (
  temperature: string | null | undefined
) => {
  if (!temperature) return null

  const value = Number(temperature)
  const scale = scaleObservable.value

  return value < TEMP_MIN || value > TEMP_MAX
    ? i18n.t('cycleDay.temperature.warning.outOfChartRange')
    : value < scale.min || value > scale.max
    ? i18n.t('cycleDay.temperature.warning.outOfUserDefinedRange')
    : ''
}

export const blank: Record<Symptom, SymptomData> = {
  bleeding: {
    exclude: false,
    value: null,
  },
  cervix: {
    exclude: false,
    firmness: null,
    opening: null,
    position: null,
  },
  desire: {
    value: null,
  },
  mood: {
    happy: null,
    sad: null,
    stressed: null,
    balanced: null,
    fine: null,
    anxious: null,
    energetic: null,
    fatigue: null,
    angry: null,
    other: null,
    note: null,
  },
  mucus: {
    exclude: false,
    feeling: null,
    texture: null,
    value: null,
  },
  note: {
    value: null,
  },
  pain: {
    cramps: null,
    ovulationPain: null,
    headache: null,
    backache: null,
    nausea: null,
    tenderBreasts: null,
    migraine: null,
    other: null,
    note: null,
  },
  sex: {
    solo: null,
    partner: null,
    condom: null,
    pill: null,
    iud: null,
    patch: null,
    ring: null,
    implant: null,
    diaphragm: null,
    none: null,
    other: null,
    note: null,
  },
  temperature: {
    exclude: false,
    note: null,
    time: LocalTime.now().truncatedTo(minutes).toString(),
    value: null,
  },
}

export const getSymptomPage = (
  t: TFunction
): Record<Symptom, SymptomConfig> => ({
  bleeding: {
    excludeText: t('cycleDay.bleeding.exclude'),
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'value',
        options: getOptionsNumeric(t, 'bleeding', 'heaviness'),
        title: t('cycleDay.bleeding.heaviness.description'),
      },
    ],
  },
  cervix: {
    excludeText: t('cycleDay.cervix.exclude'),
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'opening',
        options: getOptionsNumeric(t, 'cervix', 'opening'),
        title: t('cycleDay.cervix.opening.description'),
      },
      {
        key: 'firmness',
        options: getOptionsNumeric(t, 'cervix', 'firmness'),
        title: t('cycleDay.cervix.firmness.description'),
      },
      {
        key: 'position',
        options: getOptionsNumeric(t, 'cervix', 'position'),
        title: t('cycleDay.cervix.position.description'),
      },
    ],
  },
  desire: {
    excludeText: null,
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'value',
        options: getOptionsNumeric(t, 'desire', 'intensity'),
        title: t('cycleDay.desire.intensity.description'),
      },
    ],
  },
  mucus: {
    excludeText: t('cycleDay.mucus.exclude'),
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'feeling',
        options: getOptionsNumeric(t, 'mucus', 'feeling'),
        title: t('cycleDay.mucus.feeling.description'),
      },
      {
        key: 'texture',
        options: getOptionsNumeric(t, 'mucus', 'texture'),
        title: t('cycleDay.mucus.texture.description'),
      },
    ],
  },
  mood: {
    excludeText: null,
    note: null,
    selectBoxGroups: [
      {
        key: 'mood',
        options: getOptions(t, 'mood', 'feelings'),
        title: t('cycleDay.mood.feelings.description'),
      },
    ],
    selectTabGroups: null,
  },
  note: {
    excludeText: null,
    note: t('cycleDay.note.description'),
    selectBoxGroups: null,
    selectTabGroups: null,
  },
  pain: {
    excludeText: null,
    note: null,
    selectBoxGroups: [
      {
        key: 'pain',
        options: getOptions(t, 'pain', 'feelings'),
        title: t('cycleDay.pain.feelings.description'),
      },
    ],
    selectTabGroups: null,
  },
  sex: {
    excludeText: null,
    note: null,
    selectBoxGroups: [
      {
        key: 'sex',
        options: getOptions(t, 'sex', 'activity'),
        title: t('cycleDay.sex.activity.description'),
      },
      {
        key: 'contraceptives',
        options: getOptions(t, 'sex', 'contraceptives'),
        title: t('cycleDay.sex.contraceptives.description'),
      },
    ],
    selectTabGroups: null,
  },
  temperature: {
    excludeText: t('cycleDay.temperature.exclude'),
    note: t('cycleDay.temperature.note'),
    selectBoxGroups: null,
    selectTabGroups: null,
  },
})

export const save: Record<Symptom, SaveSymptomData> = {
  bleeding: (data, date, shouldDeleteData) => {
    const { exclude, value } = data
    const isDataEntered = isNumber(value)
    const valuesToSave =
      shouldDeleteData || !isDataEntered ? null : { value, exclude }

    saveSymptom('bleeding', date, valuesToSave)
  },
  cervix: (data, date, shouldDeleteData) => {
    const { opening, firmness, position, exclude } = data
    const isDataEntered = ['opening', 'firmness', 'position'].some((value) =>
      isNumber(data[value])
    )
    const valuesToSave =
      shouldDeleteData || !isDataEntered
        ? null
        : { opening, firmness, position, exclude }

    saveSymptom('cervix', date, valuesToSave)
  },
  desire: (data, date, shouldDeleteData) => {
    const { value } = data
    const valuesToSave = shouldDeleteData || !isNumber(value) ? null : { value }

    saveSymptom('desire', date, valuesToSave)
  },
  mood: (data, date, shouldDeleteData) => {
    saveBoxSymptom(data, date, shouldDeleteData, 'mood')
  },
  mucus: (data, date, shouldDeleteData) => {
    const { feeling, texture, exclude } = data
    const isDataEntered = ['feeling', 'texture'].some((value) =>
      isNumber(data[value])
    )
    const valuesToSave =
      shouldDeleteData || !isDataEntered
        ? null
        : {
            feeling,
            texture,
            value: computeNfpValue(feeling, texture),
            exclude,
          }

    saveSymptom('mucus', date, valuesToSave)
  },
  note: (data, date, shouldDeleteData) => {
    const { value } = data
    const isValidData = value !== null && value !== ''
    const valuesToSave = shouldDeleteData || !isValidData ? null : { value }

    saveSymptom('note', date, valuesToSave)
  },
  pain: (data, date, shouldDeleteData) => {
    saveBoxSymptom(data, date, shouldDeleteData, 'pain')
  },
  sex: (data, date, shouldDeleteData) => {
    saveBoxSymptom(data, date, shouldDeleteData, 'sex')
  },
  temperature: (data, date, shouldDeleteData) => {
    const { exclude, note, time, value } = data
    const valuesToSave = {
      exclude,
      note,
      time,
      value: Number(value),
    }

    saveSymptom(
      'temperature',
      date,
      shouldDeleteData || value === null ? null : valuesToSave
    )
  },
}

const saveBoxSymptom = (
  data: SymptomData,
  date: string,
  shouldDeleteData: boolean,
  symptom: Symptom
) => {
  const isDataEntered = Object.keys(data).some((key) => data[key] !== null)
  const valuesToSave = shouldDeleteData || !isDataEntered ? null : data

  saveSymptom(symptom, date, valuesToSave)
}

/**
 * Function to generate labels for symptom data where users can add note
 * @param {Object} symptomData maps each symptom to user input, e.g. {"condom": true, "diaphragm": false, "note": "Some user input",...}
 * @param {*} categories Allow to to look for translations in different categories, e.g. `sex.activity` and `sex.contraceptives`
 * @returns Comma-separated labels
 */
const getLabelWithNote = (
  symptomData: SymptomData | null,
  categories: [string, string][]
) => {
  const relevantSymptoms = symptomData
    ? Object.keys(symptomData).filter((symptom) =>
        Boolean(symptomData[symptom])
      )
    : []

  const labels = relevantSymptoms.reduce<string[]>((labels, symptom) => {
    if (symptom === 'note') {
      return labels
    }
    const translationKeys = categories.map(
      ([category, subCategory]) =>
        `cycleDay.${category}.${subCategory}.symptoms.${symptom}`
    )
    const label = i18n.t(translationKeys)

    if (symptom === 'other') {
      const noteLabel = symptomData?.note ? ` (${symptomData.note})` : ''

      return [...labels, label.concat(noteLabel)]
    }
    return [...labels, label]
  }, [])

  if (labels.length === 0) {
    return null
  }

  return labels.join(', ')
}

const label: Record<Symptom, GetSymptomLabel> = {
  bleeding: ({ value, exclude }) => {
    if (isNumber(value)) {
      const symptom = SYMPTOMS.bleeding.heaviness[value]
      const bleedingLabel = i18n.t(
        `cycleDay.bleeding.heaviness.symptoms.${symptom}`
      )
      return exclude ? `(${bleedingLabel})` : bleedingLabel
    }
  },
  temperature: ({ value, time, exclude }) => {
    if (isNumber(value)) {
      let temperatureLabel = `${value} °C`
      if (time) {
        temperatureLabel += ` - ${time}`
      }
      if (exclude) {
        temperatureLabel = `(${temperatureLabel})`
      }
      return temperatureLabel
    }
  },
  mucus: (mucus) => {
    const filledCategories = (['feeling', 'texture'] as const).filter((c) =>
      isNumber(mucus[c])
    )
    let label = filledCategories
      .map((category) => {
        const mucusSymptoms = SYMPTOMS.mucus[category]
        const symptomValue = mucus[category] as number
        const symptom = mucusSymptoms[symptomValue]
        return (
          i18n.t(`cycleDay.mucus.${category}.title`) +
          ': ' +
          i18n.t(`cycleDay.mucus.${category}.symptoms.${symptom}`)
        )
      })
      .join(', ')

    if (isNumber(mucus.value)) {
      label += ` => ${i18n.t(`cycleDay.mucus.nfp.${mucus.value}`)}`
    }

    if (mucus.exclude) label = `(${label})`

    return label
  },
  cervix: (cervix) => {
    const filledCategories = (
      ['opening', 'firmness', 'position'] as const
    ).filter((c) => isNumber(cervix[c]))
    let label = filledCategories
      .map((category) => {
        const cervixSymptoms = SYMPTOMS.cervix[category]
        const symptomValue = cervix[category] as number
        const symptom = cervixSymptoms[symptomValue]
        return (
          i18n.t(`cycleDay.cervix.${category}.title`) +
          ': ' +
          i18n.t(`cycleDay.cervix.${category}.symptoms.${symptom}`)
        )
      })
      .join(', ')

    if (cervix.exclude) label = `(${label})`

    return label
  },
  note: (note) => note.value as string | null,
  desire: ({ value }) => {
    if (isNumber(value)) {
      const intensitySymptoms = SYMPTOMS.desire.intensity
      const symptom = intensitySymptoms[value]
      return i18n.t(`cycleDay.desire.intensity.symptoms.${symptom}`)
    }
  },
  sex: (sex) => {
    sex = mapRealmObjToJsObj(sex)

    return getLabelWithNote(sex, [
      ['sex', 'activity'],
      ['sex', 'contraceptives'],
    ])
  },
  pain: (pain) => {
    pain = mapRealmObjToJsObj(pain)
    return getLabelWithNote(pain, [['pain', 'feelings']])
  },
  mood: (mood) => {
    mood = mapRealmObjToJsObj(mood)

    return getLabelWithNote(mood, [['mood', 'feelings']])
  },
}

export const getData = (symptom: Symptom, symptomData: SymptomData | null) => {
  return symptomData && label[symptom](symptomData)
}

export const prevDate = (dateString: string) => {
  return LocalDate.parse(dateString).minusDays(1).toString()
}

export const nextDate = (dateString: string) => {
  return LocalDate.parse(dateString).plusDays(1).toString()
}

export const isDateInFuture = (dateString: string) => {
  return LocalDate.now().isBefore(LocalDate.parse(dateString))
}
