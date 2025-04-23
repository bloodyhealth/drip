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
  mucus: {
    feeling: ['dry', 'nothing', 'wet', 'slippery'],
    texture: ['nothing', 'creamy', 'eggWhite'],
  },
  desire: {
    intensity: ['low', 'medium', 'high'],
  },
}

export const getLabelsList = (categories) =>
  categories.map((label, i) => ({ label, value: i }))

export const getLabelsListNew = (category, subCategory) => {
  const symptoms = SYMPTOMS[category][subCategory]
  return symptoms.map((symptom, i) => ({
    label: i18n.t(`cycleDay.${category}.${subCategory}.symptoms.${symptom}`),
    value: i,
  }))
}
