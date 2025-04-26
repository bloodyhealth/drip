import i18n from '../../i18n/i18n'

export const SYMPTOMS = {
  bleeding: {
    heaviness: ['spotting', 'light', 'medium', 'heavy'],
  },
  cervix: {
    opening: ['closed', 'medium', 'open'],
    firmness: ['hard', 'soft'],
    position: ['low', 'medium', 'high'],
  },
  mood: {
    feelings: [
      'happy',
      'sad',
      'stressed',
      'balanced',
      'fine',
      'anxious',
      'energetic',
      'fatigue',
      'angry',
      'other',
    ],
  },
  mucus: {
    feeling: ['dry', 'nothing', 'wet', 'slippery'],
    texture: ['nothing', 'creamy', 'eggWhite'],
  },
  desire: {
    intensity: ['low', 'medium', 'high'],
  },
  sex: {
    activity: ['solo', 'partner'],
    contraceptives: [
      'condom',
      'pill',
      'iud',
      'patch',
      'ring',
      'implant',
      'diaphragm',
      'none',
      'other',
    ],
  },
}

/**
 * Generates symptom labels and numeric values
 * @returns Symptom labels mapped to numeric values
 * e.g. [{"label": "hard", "value": 0}, {"label": "soft", "value": 1}]
 */
export const getOptionsNumeric = (category, subCategory) => {
  const symptoms = SYMPTOMS[category][subCategory]
  return symptoms.map((symptom, i) => ({
    label: i18n.t(`cycleDay.${category}.${subCategory}.symptoms.${symptom}`),
    value: i,
  }))
}

/**
 * Generates symptom labels and string values
 * @returns Symptom keys mapped to string labels,
 * e.g. {"partner": "Partner", "solo": "Solo"}
 */
export const getOptions = (category, subCategory) => {
  const symptoms = SYMPTOMS[category][subCategory]

  const labels = symptoms.map((symptom) => [
    symptom,
    i18n.t(`cycleDay.${category}.${subCategory}.symptoms.${symptom}`),
  ])

  return Object.fromEntries(labels)
}
