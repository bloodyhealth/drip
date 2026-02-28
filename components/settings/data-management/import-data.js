import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Platform } from 'react-native'
import { pick, types } from '@react-native-documents/picker'
import * as fs from '@dr.pogodin/react-native-fs'
import importCsv from '../../../lib/import-export/import-from-csv'
import alertError from '../common/alert-error'
import Segment from '../../common/segment'
import AppText from '../../common/app-text'
import Button from '../../common/button'
import { useTranslation } from 'react-i18next'

export default function ImportData({
  closePasswordConfirmation,
  setIsLoading,
}) {
  const { t } = useTranslation(null, {
    keyPrefix: 'sideMenu.settings.data.import',
  })

  async function startImport(shouldDeleteExistingData) {
    setIsLoading(true)
    await importData(shouldDeleteExistingData)
    setIsLoading(false)
  }

  async function getFileInfo() {
    try {
      const fileInfo = await pick({
        type: [types.csv, 'text/comma-separated-values'],
      })
      return fileInfo[0]
    } catch (error) {
      if (error?.code === 'OPERATION_CANCELED') return // User cancelled the picker, exit any dialogs or menus and move on
      showImportErrorAlert(error)
    }
  }

  async function getFilePath(fileInfo) {
    if (Platform.OS === 'ios') {
      return decodeURI(fileInfo.uri)
    }
    const destPath = `${fs.TemporaryDirectoryPath}/${fileInfo.name}`
    await fs.copyFile(fileInfo.uri, destPath)
    return destPath
  }

  async function getFileContent() {
    const fileInfo = await getFileInfo()
    if (!fileInfo) return null

    try {
      const filePath = await getFilePath(fileInfo)

      return await fs.readFile(filePath, 'utf8')
    } catch {
      showImportErrorAlert(t('error.couldNotOpenFile'))
      return null
    }
  }

  async function importData(shouldDeleteExistingData) {
    const fileContent = await getFileContent()
    if (!fileContent) return

    try {
      await importCsv(fileContent, shouldDeleteExistingData)
      Alert.alert(t('success.title'), t('success.message'))
    } catch (err) {
      showImportErrorAlert(err.message)
    }
  }

  function openImportDialog() {
    closePasswordConfirmation()

    let buttons = [
      {
        text: t('dialog.cancel'),
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: t('dialog.replace'),
        onPress: () => startImport(false),
      },
      {
        text: t('dialog.delete'),
        onPress: () => startImport(true),
      },
    ]

    if (Platform.OS === 'android') {
      buttons = [buttons[0], buttons[2], buttons[1]]
    }

    Alert.alert(t('dialog.title'), t('dialog.message'), buttons)
  }

  function showImportErrorAlert(message) {
    const errorMessage = t('error.noDataImported', { message })
    alertError(errorMessage)
  }

  return (
    <Segment title={t('button')}>
      <AppText>{t('segmentExplainer')}</AppText>
      <Button isCTA onPress={openImportDialog}>
        {t('button')}
      </Button>
    </Segment>
  )
}

ImportData.propTypes = {
  closePasswordConfirmation: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
}
