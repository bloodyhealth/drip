import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppText } from '@/components/common/app-text'

import { Symptom } from '@/config'

interface LearnMoreProps {
  symptom: Symptom
}

export const LearnMore = ({ symptom }: LearnMoreProps) => {
  const { t } = useTranslation()
  const nfpKey = NFP_SYMPTOMS.includes(symptom)
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

const NFP_SYMPTOMS: Symptom[] = ['bleeding', 'temperature', 'mucus', 'cervix']
