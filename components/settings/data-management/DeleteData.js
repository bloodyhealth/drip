import React, { useState } from 'react'
import RNFS from 'react-native-fs'
import { Alert } from 'react-native'
import PropTypes from 'prop-types'

import Button from '../../common/button'

import ConfirmWithPassword from '../common/confirm-with-password'
import alertError from '../common/alert-error'

import { clearDb, isDbEmpty } from '../../../db'
import { showToast } from '../../helpers/general'
import { hasEncryptionObservable } from '../../../local-storage'
import { EXPORT_FILE_NAME } from './constants'
import Segment from '../../common/segment'
import AppText from '../../common/app-text'
import { useTranslation } from 'react-i18next'

const exportedFilePath = `${RNFS.DocumentDirectoryPath}/${EXPORT_FILE_NAME}`

const DeleteData = ({ onStartDeletion, isDeletingData }) => {
  const isPasswordSet = hasEncryptionObservable.value
  const [isConfirmingWithPassword, setIsConfirmingWithPassword] =
    useState(false)

  const { t } = useTranslation(null, {
    keyPrefix: 'hamburgerMenu.settings.data.delete',
  })

  const onAlertConfirmation = () => {
    onStartDeletion()
    if (isPasswordSet) {
      setIsConfirmingWithPassword(true)
    } else {
      deleteAppData()
    }
  }

  const alertBeforeDeletion = async () => {
    if (isDbEmpty() && !(await RNFS.exists(exportedFilePath))) {
      alertError(t('error.noData'))
    } else {
      Alert.alert(t('dialog.title'), t('dialog.message'), [
        {
          text: t('dialog.delete'),
          onPress: onAlertConfirmation,
        },
        {
          text: t('dialog.cancel'),
          style: 'cancel',
          onPress: cancelConfirmationWithPassword,
        },
      ])
    }
  }

  const deleteExportedFile = async () => {
    if (await RNFS.exists(exportedFilePath)) {
      await RNFS.unlink(exportedFilePath)
    }
  }

  const deleteAppData = async () => {
    try {
      if (!isDbEmpty()) {
        clearDb()
      }
      await deleteExportedFile()
      showToast(t('success.message'))
    } catch (err) {
      alertError(t('error.delete'))
    }
    cancelConfirmationWithPassword()
  }

  const cancelConfirmationWithPassword = () => {
    setIsConfirmingWithPassword(false)
  }

  if (isConfirmingWithPassword && isDeletingData) {
    return (
      <ConfirmWithPassword
        onSuccess={deleteAppData}
        onCancel={cancelConfirmationWithPassword}
      />
    )
  }

  return (
    <Segment title={t('title')} last>
      <AppText>{t('subTitle')}</AppText>
      <Button isCTA onPress={alertBeforeDeletion}>
        {t('title')}
      </Button>
    </Segment>
  )
}

DeleteData.propTypes = {
  isDeletingData: PropTypes.bool,
  onStartDeletion: PropTypes.func.isRequired,
}

export default DeleteData
