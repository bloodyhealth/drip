import React from 'react'
import { Linking, Platform, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'

import AppPage from '../common/app-page'
import { AppText } from '../common/app-text'
import AppLink from '../common/app-link'
import { getLinks } from '../../common/links'
import { Segment } from '../common/segment'
import Button from '../common/button'
import ButtonRow from '../common/button-row'
import { Spacing } from '../../styles'

const AboutSection = () => {
  const { t } = useTranslation(null, { keyPrefix: 'sideMenu.about' })
  const { t: tRoot } = useTranslation()
  const links = getLinks(tRoot)

  return (
    <AppPage title={t('title')}>
      <Segment>
        <AppText>{t('intro.text')}</AppText>
        <Button onPress={() => Linking.openURL(links.faq.url)}>
          {t('intro.faq')}
        </Button>
        <AppText style={styles.marginTop}>{t('intro.contact')}</AppText>
        <ButtonRow>
          {[links.email, links.gitlab, links.website].map((link) => (
            <Button key={link.url} onPress={() => Linking.openURL(link.url)}>
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
          <AppLink url={links.flaticon.url}>flaticon</AppLink>.{' '}
        </AppText>
        <AppText>
          {t('credits.madeBy')}{' '}
          <AppLink url={links.smashicons.url}>smashicons</AppLink>,{' '}
          <AppLink url={links.pause08.url}>pause08</AppLink>,{' '}
          <AppLink url={links.kazachek.url}>kazachek</AppLink>,{' '}
          <AppLink url={links.freepik.url}>freepik</AppLink>.
        </AppText>
      </Segment>
      <Segment title={t('donate.title')}>
        <AppText>{t('donate.text')}</AppText>
        {Platform.OS !== 'ios' && (
          <Button onPress={() => Linking.openURL(links.donate.url)}>
            {t('donate.button')}
          </Button>
        )}
      </Segment>
      <Segment title={t('version.title')} last>
        <AppText>{require('../../../package.json').version}</AppText>
      </Segment>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: Spacing.base,
  },
})

export default AboutSection
