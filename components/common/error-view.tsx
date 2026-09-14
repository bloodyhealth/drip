import React, { ComponentType, ReactNode } from 'react'
import {
  Linking,
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { useTranslation } from 'react-i18next'

import AppPageJs from './app-page'
import AppTextJs from './app-text'
import ButtonJs from './button'
import ButtonRowJs from './button-row'
import SegmentJs from './segment'

import links from '../../common/links'
import { version } from '../../package.json'
import { Colors, Sizes } from '../../styles'

// The shared components are plain JS, so TypeScript infers every destructured
// prop as required. Re-typing them here keeps that inference out of the JSX
// below without adding declarations next to the JS files.
const AppPage = AppPageJs as ComponentType<{
  children?: ReactNode
  title?: string
}>
const AppText = AppTextJs as ComponentType<{
  children?: ReactNode
  style?: StyleProp<TextStyle>
}>
const Button = ButtonJs as ComponentType<{
  children?: ReactNode
  iconName?: string
  isCTA?: boolean
  isSmall?: boolean
  onPress?: () => void
  testID?: string
  style?: StyleProp<ViewStyle>
}>
const ButtonRow = ButtonRowJs as ComponentType<{ children: ReactNode }>
const Segment = SegmentJs as ComponentType<{
  children?: ReactNode
  last?: boolean
  title?: string
}>

const osNames: Record<string, string> = {
  android: 'Android',
  ios: 'iOS',
}

type Props = {
  error?: Error | null
  onRetry: () => void
}

export const ErrorView = ({ error, onRetry }: Props) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'errorBoundary' })

  const platform = `${osNames[Platform.OS] ?? Platform.OS} ${Platform.Version}`
  const message = error ? String(error.message || error) : ''

  const onPressEmail = () => {
    const subject = t('contact.emailSubject', { version })
    const body = [
      `${t('details.version')}: ${version}`,
      `${t('details.platform')}: ${platform}`,
      `${t('details.message')}: ${message}`,
      '',
    ].join('\n')

    Linking.openURL(
      `${links.email.url}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    )
  }

  return (
    <AppPage title={t('title')}>
      <Segment>
        <AppText>{t('intro')}</AppText>
        <Button isCTA isSmall onPress={onRetry}>
          {t('retry')}
        </Button>
      </Segment>
      <Segment title={t('contact.title')}>
        <AppText>{t('contact.text')}</AppText>
        <ButtonRow>
          <Button isCTA isSmall onPress={onPressEmail}>
            {links.email.text}
          </Button>
          <Button
            isCTA
            isSmall
            onPress={() => Linking.openURL(links.gitlabIssues.url)}
          >
            {links.gitlabIssues.text}
          </Button>
        </ButtonRow>
      </Segment>
      <Segment title={t('details.title')} last>
        <AppText style={styles.detail}>
          {t('details.version')}: {version}
        </AppText>
        <AppText style={styles.detail}>
          {t('details.platform')}: {platform}
        </AppText>
        <AppText style={styles.detail}>
          {t('details.message')}: {message}
        </AppText>
      </Segment>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  detail: {
    color: Colors.grey,
    fontSize: Sizes.small,
  },
})
