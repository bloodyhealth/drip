import { ChronoUnit, LocalDate, LocalTime } from '@js-joda/core'

import {
  getPreviousTemperatureForDate,
  saveSymptom,
  mapRealmObjToJsObj,
} from '../../db'
import { scaleObservable } from '../../local-storage'

import { getOptions, getOptionsNumeric, SYMPTOMS } from './labels'
import { TEMP_MAX, TEMP_MIN } from '../../config'
import i18n from '../../i18n/i18n'

import computeNfpValue from '../../lib/nfp-mucus'

const minutes = ChronoUnit.MINUTES

const isNumber = (value) => typeof value === 'number'
export const shouldShow = (value) => value !== null

export const formatTemperature = (temperature) =>
  !temperature
    ? temperature
    : Number.parseFloat(temperature.toString()).toFixed(2)

//maximum of precision digits after decimal point, but no x.0
export const formatDecimal = (num, precision) =>
  +parseFloat(Number.parseFloat(num).toFixed(precision))

export const getPreviousTemperature = (date) => {
  const previousTemperature = getPreviousTemperatureForDate(date)
  return formatTemperature(previousTemperature)
}

export const getTemperatureOutOfRangeMessage = (temperature) => {
  if (!temperature) return null

  const value = Number(temperature)
  const scale = scaleObservable.value

  return value < TEMP_MIN || value > TEMP_MAX
    ? i18n.t('cycleDay.temperature.warning.outOfChartRange')
    : value < scale.min || value > scale.max
    ? i18n.t('cycleDay.temperature.warning.outOfUserDefinedRange')
    : ''
}

export const blank = {
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

export const symtomPage = {
  bleeding: {
    excludeText: i18n.t('cycleDay.bleeding.exclude'),
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'value',
        options: getOptionsNumeric('bleeding', 'heaviness'),
        title: i18n.t('cycleDay.bleeding.heaviness.description'),
      },
    ],
  },
  cervix: {
    excludeText: i18n.t('cycleDay.cervix.exclude'),
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'opening',
        options: getOptionsNumeric('cervix', 'opening'),
        title: i18n.t('cycleDay.cervix.opening.description'),
      },
      {
        key: 'firmness',
        options: getOptionsNumeric('cervix', 'firmness'),
        title: i18n.t('cycleDay.cervix.firmness.description'),
      },
      {
        key: 'position',
        options: getOptionsNumeric('cervix', 'position'),
        title: i18n.t('cycleDay.cervix.position.description'),
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
        options: getOptionsNumeric('desire', 'intensity'),
        title: i18n.t('cycleDay.desire.intensity.description'),
      },
    ],
  },
  mucus: {
    excludeText: i18n.t('cycleDay.mucus.exclude'),
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'feeling',
        options: getOptionsNumeric('mucus', 'feeling'),
        title: i18n.t('cycleDay.mucus.feeling.description'),
      },
      {
        key: 'texture',
        options: getOptionsNumeric('mucus', 'texture'),
        title: i18n.t('cycleDay.mucus.texture.description'),
      },
    ],
  },
  mood: {
    excludeText: null,
    note: null,
    selectBoxGroups: [
      {
        key: 'mood',
        options: getOptions('mood', 'feelings'),
        title: i18n.t('cycleDay.mood.feelings.description'),
      },
    ],
    selectTabGroups: null,
  },
  note: {
    excludeText: null,
    note: i18n.t('cycleDay.note.description'),
    selectBoxGroups: null,
    selectTabGroups: null,
  },
  pain: {
    excludeText: null,
    note: null,
    selectBoxGroups: [
      {
        key: 'pain',
        options: getOptions('pain', 'feelings'),
        title: i18n.t('cycleDay.pain.feelings.description'),
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
        options: getOptions('sex', 'activity'),
        title: i18n.t('cycleDay.sex.activity.description'),
      },
      {
        key: 'contraceptives',
        options: getOptions('sex', 'contraceptives'),
        title: i18n.t('cycleDay.sex.contraceptives.description'),
      },
    ],
    selectTabGroups: null,
  },
  temperature: {
    excludeText: i18n.t('cycleDay.temperature.exclude'),
    note: i18n.t('cycleDay.temperature.note'),
    selectBoxGroups: null,
    selectTabGroups: null,
  },
}

export const save = {
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

const saveBoxSymptom = (data, date, shouldDeleteData, symptom) => {
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
const getLabelWithNote = (symptomData, categories) => {
  const relevantSymptoms = symptomData
    ? Object.keys(symptomData).filter((symptom) =>
        Boolean(symptomData[symptom])
      )
    : []

  const labels = relevantSymptoms.reduce((labels, symptom) => {
    if (symptom === 'note') {
      return labels
    }
    const translationKeys = categories.map(
      ([category, subCategory]) =>
        `cycleDay.${category}.${subCategory}.symptoms.${symptom}`
    )
    const label = i18n.t(translationKeys)

    if (symptom === 'other') {
      const noteLabel = symptomData.note ? ` (${symptomData.note})` : ''

      return [...labels, label.concat(noteLabel)]
    }
    return [...labels, label]
  }, [])

  return labels.join(', ')
}

const label = {
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
    const filledCategories = ['feeling', 'texture'].filter((c) =>
      isNumber(mucus[c])
    )
    let label = filledCategories
      .map((category) => {
        const mucusSymptoms = SYMPTOMS.mucus[category]
        const symptomValue = mucus[category]
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
    const filledCategories = ['opening', 'firmness', 'position'].filter((c) =>
      isNumber(cervix[c])
    )
    let label = filledCategories
      .map((category) => {
        const cervixSymptoms = SYMPTOMS.cervix[category]
        const symptomValue = cervix[category]
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
  note: (note) => note.value,
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

export const getData = (symptom, symptomData) => {
  return symptomData && label[symptom](symptomData)
}

export const prevDate = (dateString) => {
  return LocalDate.parse(dateString).minusDays(1).toString()
}

export const nextDate = (dateString) => {
  return LocalDate.parse(dateString).plusDays(1).toString()
}

export const isDateInFuture = (dateString) => {
  return LocalDate.now().isBefore(LocalDate.parse(dateString))
}
