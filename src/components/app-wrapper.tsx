import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { ErrorBoundary } from './common/error-boundary'
import AcceptLicense from './accept-license'
import PasswordPrompt from './password-prompt'
import { AppControl, AppControlContext } from '@/context/app-control-context'

export default function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLicenseAccepted, setIsLicenseAccepted] = useState(false)
  const [isDbEncrypted, setIsDbEncrypted] = useState(false)
  const [dbSession, setDbSession] = useState(0)

  const checkIsLicenseAccepted = async () => {
    const isLicenseFlagSet = await getLicenseFlag()
    setIsLicenseAccepted(Boolean(isLicenseFlagSet))
  }

  const loadLanguage = async () => {
    const storedLanguage = await getLanguage()
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage)
    }
  }

  const checkIsDbEncrypted = useCallback(async () => {
    const isEncrypted = !(await openDb())
    if (isEncrypted) setIsDbEncrypted(true)
    else setDbSession((session) => session + 1)
    await saveEncryptionFlag(isEncrypted)
  }, [])

  const appControl = useMemo<AppControl>(
    () => ({ restartApp: checkIsDbEncrypted }),
    [checkIsDbEncrypted]
  )

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

    return (
      <AppControlContext.Provider value={appControl}>
        {/* a new db session starts a fresh app and navigation, so no screen
            or reminder listener keeps references into the closed realm */}
        <App key={dbSession} />
      </AppControlContext.Provider>
    )
  }

  const showStatusBar = !isLoading && isLicenseAccepted

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'bottom', 'left', 'right']}
        style={styles.container}
      >
        {showStatusBar && <AppStatusBar />}
        <ErrorBoundary>{renderContent()}</ErrorBoundary>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
