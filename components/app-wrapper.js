import React, { useState, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
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
import AcceptLicense from './AcceptLicense'
import PasswordPrompt from './PasswordPrompt'

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

  if (isLoading) {
    return <AppLoadingView />
  }

  if (!isLicenseAccepted) {
    return <AcceptLicense setLicense={() => setIsLicenseAccepted(true)} />
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AppStatusBar />
      {isDbEncrypted ? (
        <PasswordPrompt enableShowApp={() => setIsDbEncrypted(false)} />
      ) : (
        <App restartApp={() => checkIsDbEncrypted()} />
      )}
    </I18nextProvider>
  )
}
