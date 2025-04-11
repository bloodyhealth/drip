import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Button from '../../common/button'

import EnterNewPassword from './enter-new-password'
import showBackUpReminder from './show-backup-reminder'

import { useTranslation } from 'react-i18next'

const CreatePassword = ({ changeEncryptionAndRestart }) => {
  const { t } = useTranslation()
  const [isSettingPassword, setIsSettingPassword] = useState(false)

  const startSettingPassword = () => {
    showBackUpReminder(
      () => {
        setIsSettingPassword(true)
      },
      () => {}
    )
  }

  if (!isSettingPassword) {
    return (
      <Button isCTA onPress={startSettingPassword}>
        {t('password.buttons.create')}
      </Button>
    )
  }

  return (
    <EnterNewPassword changeEncryptionAndRestart={changeEncryptionAndRestart} />
  )
}

CreatePassword.propTypes = {
  changeEncryptionAndRestart: PropTypes.func,
}

export default CreatePassword
