import React from 'react'
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

const DeleteData = ({
  closePasswordConfirmation,
  openPasswordConfirmation,
  isPasswordConfirmationOpen,
}) => {
  const { t } = useTranslation(null, {
    keyPrefix: 'hamburgerMenu.settings.data.delete',
  })

  const isPasswordSet = hasEncryptionObservable.value

  const onAlertConfirmation = () => {
    isPasswordSet ? openPasswordConfirmation() : deleteAppData()
  }

  const alertBeforeDeletion = async () => {
    const hasNoData = isDbEmpty() && !(await RNFS.exists(exportedFilePath))
    if (hasNoData) {
      return alertError(t('error.noData'))
    }

    Alert.alert(t('dialog.title'), t('dialog.message'), [
      {
        text: t('dialog.delete'),
        onPress: onAlertConfirmation,
      },
      {
        text: t('dialog.cancel'),
        style: 'cancel',
        onPress: closePasswordConfirmation,
      },
    ])
  }

  const deleteExportedFile = async () => {
    const doesFileExist = await RNFS.exists(exportedFilePath)
    if (doesFileExist) {
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
    } finally {
      closePasswordConfirmation()
    }
  }

  return (
    <Segment title={t('title')} last>
      <AppText>{t('subTitle')}</AppText>
      {isPasswordConfirmationOpen ? (
        <ConfirmWithPassword
          onSuccess={deleteAppData}
          onCancel={closePasswordConfirmation}
        />
      ) : (
        <Button isCTA onPress={alertBeforeDeletion}>
          {t('title')}
        </Button>
      )}
    </Segment>
  )
}

DeleteData.propTypes = {
  isPasswordConfirmationOpen: PropTypes.bool.isRequired,
  openPasswordConfirmation: PropTypes.func.isRequired,
  closePasswordConfirmation: PropTypes.func.isRequired,
}

export default DeleteData
