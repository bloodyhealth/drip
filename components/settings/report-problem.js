import React, { useState } from 'react'
import { Alert, Text } from 'react-native'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { useTranslation } from 'react-i18next'

import AppLoadingView from '../common/app-loading'
import AppPage from '../common/app-page'
import AppText from '../common/app-text'
import Button from '../common/button'
import Segment from '../common/segment'
import alertError from './common/alert-error'
import logger from '../../common/logger/logger'
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
      // Get current log file path (based on today's date)
      const logPath = logger.finalize()

      // Check if log file exists
      const fileExists = await RNFS.exists(logPath)
      if (!fileExists) {
        alertError(t('error.noLogFile'))
        setIsLoading(false)
        return
      }

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

  async function clearAllLogFiles() {
    Alert.alert(t('clearLogs.confirmTitle'), t('clearLogs.confirmMessage'), [
      {
        text: t('clearLogs.cancel'),
        style: 'cancel',
      },
      {
        text: t('clearLogs.confirm'),
        onPress: async () => {
          setIsLoading(true)
          try {
            const deletedCount = await logger.clearAllLogFiles()
            Alert.alert(
              t('clearLogs.successTitle'),
              t('clearLogs.successMessage', { count: deletedCount })
            )
          } catch (error) {
            alertError(t('clearLogs.error'))
          } finally {
            setIsLoading(false)
          }
        },
      },
    ])
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
        <Button onPress={clearAllLogFiles}>{t('clearLogs.button')}</Button>
      </Segment>
    </AppPage>
  )
}
