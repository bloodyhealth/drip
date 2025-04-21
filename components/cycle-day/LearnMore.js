import React from 'react'
import PropTypes from 'prop-types'
import links from '../../i18n/en/links'
import { Trans, useTranslation } from 'react-i18next'
import AppText from '../common/app-text'
import AppLink from '../common/AppLink'

export const LearnMore = ({ symptom }) => {
  const { t } = useTranslation()
  const nfpKey = ['bleeding', 'temperature', 'mucus', 'cervix'].includes(
    symptom
  )
    ? 'nfpTfyReminder'
    : 'nfpCurious'
  return (
    <AppText>
      {t(`cycleDay.symptomEditModal.learnMore.symptoms.${symptom}.description`)}
      <Trans
        t={t}
        i18nKey={`cycleDay.symptomEditModal.learnMore.generalInfo.${nfpKey}`}
        components={[<AppLink key={links.wiki.url} url={links.wiki.url} />]}
        values={{ urlText: links.wiki.text }}
      ></Trans>
    </AppText>
  )
}

LearnMore.propTypes = {
  symptom: PropTypes.string.isRequired,
}
