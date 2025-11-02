import React, { useState } from 'react'
import { Text } from 'react-native'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { useTranslation } from 'react-i18next'

import AppLoadingView from '../common/app-loading'
import AppPage from '../common/app-page'
import AppText from '../common/app-text'
import Button from '../common/button'
import Segment from '../common/segment'
import alertError from './common/alert-error'
import { LOG_CONFIG } from '../../common/logger/constants'
import links from '../../common/links'
import { Colors } from '../../styles'

export default function ReportProblem() {
  const { t } = useTranslation(null, {
    keyPrefix: 'sideMenu.reportProblem',
  })
  const [isLoading, setIsLoading] = useState(false)

  // Extract email address from mailto URL (remove "mailto:" prefix)
  const emailAddress = links.email.url.replace('mailto:', '')

  async function shareLogFile() {
    setIsLoading(true)
    try {
      const logPath = LOG_CONFIG.path

      // Check if log file exists
      const fileExists = await RNFS.exists(logPath)
      if (!fileExists) {
        alertError(t('error.noLogFile'))
        setIsLoading(false)
        return
      }

      // Share the log file via email with recipient pre-filled
      // Note: 'to' parameter works on Android, iOS may require user to add recipient manually
      await Share.open({
        title: t('emailSubject'),
        url: `file://${logPath}`,
        subject: t('emailSubject'),
        message: t('emailMessage', {
          defaultValue: 'Please find the app log file attached.',
        }),
        to: emailAddress,
        type: 'text/plain',
        failOnCancel: false,
      })
    } catch (error) {
      // User cancelled or error occurred
      if (error.message !== 'User did not share') {
        alertError(t('error.sharingFailed'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <AppLoadingView />

  return (
    <AppPage title={t('title')}>
      <Segment>
        <AppText>{t('text')}</AppText>
        <AppText style={{ marginTop: 8 }}>
          <Text selectable style={{ fontWeight: 'bold', color: Colors.purple }}>
            {emailAddress}
          </Text>
        </AppText>
        <Button isCTA onPress={shareLogFile}>
          {t('button')}
        </Button>
      </Segment>
    </AppPage>
  )
}
