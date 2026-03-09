import React, { useState, useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import i18n from '../i18n/i18n'

import {
  getLicenseFlag,
  saveEncryptionFlag,
  getLanguage,
} from '../local-storage'
import { openDb } from '../db'

import App from './app'
import AppLoadingView from './common/app-loading'
import AppStatusBar from './common/app-status-bar'
import AcceptLicense from './accept-license'
import PasswordPrompt from './password-prompt'

export default function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLicenseAccepted, setIsLicenseAccepted] = useState(false)
  const [isDbEncrypted, setIsDbEncrypted] = useState(false)

  const checkIsLicenseAccepted = async () => {
    const isLicenseFlagSet = await getLicenseFlag()
    setIsLicenseAccepted(isLicenseFlagSet)
  }

  const loadLanguage = async () => {
    const storedLanguage = await getLanguage()
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage)
    }
  }

  const checkIsDbEncrypted = async () => {
    const isEncrypted = !(await openDb())
    if (isEncrypted) setIsDbEncrypted(true)
    await saveEncryptionFlag(isEncrypted)
  }

  const prepareApp = async () => {
    await Promise.all([
      checkIsLicenseAccepted(),
      loadLanguage(),
      checkIsDbEncrypted(),
    ])
    setIsLoading(false)
  }

  useEffect(() => {
    prepareApp()
  }, [])

  const renderContent = () => {
    if (isLoading) return <AppLoadingView />

    if (!isLicenseAccepted) {
      return <AcceptLicense setLicense={() => setIsLicenseAccepted(true)} />
    }

    if (isDbEncrypted) {
      return <PasswordPrompt enableShowApp={() => setIsDbEncrypted(false)} />
    }

    return <App restartApp={checkIsDbEncrypted} />
  }

  const showStatusBar = !isLoading && isLicenseAccepted

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'bottom', 'left', 'right']}
        style={styles.container}
      >
        {showStatusBar && <AppStatusBar />}
        {renderContent()}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
