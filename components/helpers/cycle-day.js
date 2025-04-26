import { ChronoUnit, LocalDate, LocalTime } from '@js-joda/core'

import {
  getPreviousTemperatureForDate,
  saveSymptom,
  mapRealmObjToJsObj,
} from '../../db'
import { scaleObservable } from '../../local-storage'

import * as labels from '../../i18n/en/cycle-day'
import { getOptions, getOptionsNumeric, SYMPTOMS } from './labels'
import { TEMP_MAX, TEMP_MIN } from '../../config'
import i18n from '../../i18n/i18n'

import computeNfpValue from '../../lib/nfp-mucus'

const moodLabels = labels.mood.categories
const noteDescription = labels.noteExplainer
const painLabels = labels.pain.categories
const temperatureLabels = labels.temperature

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
        options: moodLabels,
        title: labels.mood.explainer,
      },
    ],
    selectTabGroups: null,
  },
  note: {
    excludeText: null,
    note: noteDescription,
    selectBoxGroups: null,
    selectTabGroups: null,
  },
  pain: {
    excludeText: null,
    note: null,
    selectBoxGroups: [
      {
        key: 'pain',
        options: painLabels,
        title: labels.pain.explainer,
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
    excludeText: temperatureLabels.exclude.explainer,
    note: temperatureLabels.note.explainer,
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

    if (isNumber(mucus.value)) label += ` => ${labels.mucusNFP[mucus.value]}`
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

    const relevantSymptoms = sex
      ? Object.keys(sex).filter((symptom) => Boolean(sex[symptom]))
      : []

    return relevantSymptoms
      .reduce((labels, symptom) => {
        if (symptom === 'note') {
          return labels
        }
        if (symptom === 'other') {
          const contraceptivesLabel = i18n.t(
            `cycleDay.sex.contraceptives.symptoms.${symptom}`
          )
          const noteLabel = sex.note ? ` (${sex.note})` : ''
          const label = contraceptivesLabel + noteLabel

          return [...labels, label]
        }
        const translationKey =
          symptom === 'solo' || symptom === 'partner'
            ? 'activity'
            : 'contraceptives'
        return [
          ...labels,
          i18n.t(`cycleDay.sex.${translationKey}.symptoms.${symptom}`),
        ]
      }, [])
      .join(', ')
  },
  pain: (pain) => {
    pain = mapRealmObjToJsObj(pain)
    const painLabel = []
    if (pain && Object.values({ ...pain }).some((val) => val)) {
      Object.keys(pain).forEach((key) => {
        if (pain[key] && key !== 'other' && key !== 'note') {
          painLabel.push(painLabels[key])
        }
        if (key === 'other' && pain.other) {
          let label = painLabels[key]
          if (pain.note) {
            label = `${label} (${pain.note})`
          }
          painLabel.push(label)
        }
      })
      return painLabel.join(', ')
    }
  },
  mood: (mood) => {
    mood = mapRealmObjToJsObj(mood)
    const moodLabel = []
    if (mood && Object.values({ ...mood }).some((val) => val)) {
      Object.keys(mood).forEach((key) => {
        if (mood[key] && key !== 'other' && key !== 'note') {
          moodLabel.push(moodLabels[key])
        }
        if (key === 'other' && mood.other) {
          let label = moodLabels[key]
          if (mood.note) {
            label = `${label} (${mood.note})`
          }
          moodLabel.push(label)
        }
      })
      return moodLabel.join(', ')
    }
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
