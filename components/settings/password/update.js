import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Button from '../../common/button'

import EnterNewPassword from './enter-new-password'
import showBackUpReminder from './show-backup-reminder'
import ConfirmWithPassword from '../common/confirm-with-password'

import { useTranslation } from 'react-i18next'

const ChangePassword = ({
  changeEncryptionAndRestart,
  onStartChange,
  onCancelChange,
}) => {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState(null)
  const [enteringCurrentPassword, setEnteringCurrentPassword] = useState(false)
  const [enteringNewPassword, setEnteringNewPassword] = useState(false)

  const startChangingPassword = () => {
    showBackUpReminder(
      startEnteringCurrentPassword,
      cancelConfirmationWithPassword
    )
  }

  const startEnteringCurrentPassword = () => {
    setEnteringCurrentPassword(true)
    onStartChange()
  }

  const startEnteringNewPassword = () => {
    setCurrentPassword(null)
    setEnteringNewPassword(true)
    setEnteringCurrentPassword(false)
  }

  const cancelConfirmationWithPassword = () => {
    setCurrentPassword(null)
    setEnteringNewPassword(false)
    setEnteringCurrentPassword(false)
    onCancelChange()
  }

  const isPasswordSet = currentPassword !== null

  if (enteringCurrentPassword) {
    return (
      <ConfirmWithPassword
        onSuccess={startEnteringNewPassword}
        onCancel={cancelConfirmationWithPassword}
      />
    )
  }

  if (enteringNewPassword) {
    return (
      <EnterNewPassword
        changeEncryptionAndRestart={changeEncryptionAndRestart}
      />
    )
  }

  return (
    <Button disabled={isPasswordSet} isCTA onPress={startChangingPassword}>
      {t('password.buttons.update')}
    </Button>
  )
}

export default ChangePassword

ChangePassword.propTypes = {
  onStartChange: PropTypes.func,
  onCancelChange: PropTypes.func,
  changeEncryptionAndRestart: PropTypes.func,
}
