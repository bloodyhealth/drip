import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { AppText } from '../common/app-text'

export const LearnMore = ({ symptom }) => {
  const { t } = useTranslation()
  const nfpKey = ['bleeding', 'temperature', 'mucus', 'cervix'].includes(
    symptom
  )
    ? 'nfpThinkForYourselfReminder'
    : 'noNfpSymptom'
  return (
    <AppText>
      {t(`cycleDay.symptomEditModal.learnMore.symptoms.${symptom}.description`)}
      {'\n\n'}
      {t(`cycleDay.symptomEditModal.learnMore.generalInfo.${nfpKey}`)}
    </AppText>
  )
}

LearnMore.propTypes = {
  symptom: PropTypes.string.isRequired,
}
