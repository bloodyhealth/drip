import React, { ComponentType, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import AppLinkJs from '@/components/common/app-link'
import AppTextJs from '@/components/common/app-text'

import { getLinks } from '@/common/links'
import { Symptom } from '@/config'

interface LearnMoreProps {
  symptom: Symptom
}

export const LearnMore = ({ symptom }: LearnMoreProps) => {
  const { t } = useTranslation()
  const links = getLinks(t)
  const nfpKey = NFP_SYMPTOMS.includes(symptom)
    ? 'nfpThinkForYourselfReminder'
    : 'noNfpSymptom'

  return (
    <AppText>
      {t(`cycleDay.symptomEditModal.learnMore.symptoms.${symptom}.description`)}
      {'\n\n'}
      <Trans
        t={t}
        i18nKey={`cycleDay.symptomEditModal.learnMore.generalInfo.${nfpKey}`}
        components={[<AppLink key={links.wiki.url} url={links.wiki.url} />]}
        values={{ urlText: links.wiki.text }}
      />
    </AppText>
  )
}

const NFP_SYMPTOMS: Symptom[] = ['bleeding', 'temperature', 'mucus', 'cervix']

const AppLink = AppLinkJs as ComponentType<{ url: string }>
const AppText = AppTextJs as ComponentType<{ children?: ReactNode }>
