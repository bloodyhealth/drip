import React from 'react'
import { Platform, Linking } from 'react-native'

import AppPage from '../common/app-page'
import AppText from '../common/app-text'
import AppLink from '../common/AppLink'
import Segment from '../common/segment'
import Button from '../common/button'
import ButtonRow from '../common/button-row'

import links from '../../i18n/en/links'
import { useTranslation } from 'react-i18next'

const AboutSection = () => {
  const { t } = useTranslation(null, { keyPrefix: 'settings.about' })

  return (
    <AppPage title={t('title')}>
      <Segment>
        <AppText>{t('intro.text')}</AppText>
        <ButtonRow>
          {[links.email, links.gitlab, links.website].map((link) => (
            <Button
              key={link.url}
              isCTA
              isSmall
              onPress={() => Linking.openURL(link.url)}
            >
              {link.text}
            </Button>
          ))}
        </ButtonRow>
      </Segment>
      <Segment title={t('philosophy.title')}>
        <AppText>{t('philosophy.text')}</AppText>
      </Segment>
      <Segment title={t('credits.title')}>
        <AppText>
          {t('credits.text')}{' '}
          <AppLink link={links.flaticon.url}>flaticon</AppLink>.{' '}
        </AppText>
        <AppText>
          {t('credits.madeBy')}{' '}
          <AppLink link={links.smashicons.url}>smashicons</AppLink>,{' '}
          <AppLink link={links.pause08.url}>pause08</AppLink>,{' '}
          <AppLink link={links.kazachek.url}>kazachek</AppLink>,{' '}
          <AppLink link={links.freepik.url}>freepik</AppLink>.
        </AppText>
      </Segment>
      <Segment title={t('donate.title')}>
        <AppText>{t('donate.text')}</AppText>
        {Platform.OS !== 'ios' && (
          <Button
            isCTA
            isSmall
            onPress={() => Linking.openURL(links.donate.url)}
          >
            {t('donate.button')}
          </Button>
        )}
      </Segment>
      <Segment title={t('version.title')} last>
        <AppText>{require('../../package.json').version}</AppText>
      </Segment>
    </AppPage>
  )
}

export default AboutSection
