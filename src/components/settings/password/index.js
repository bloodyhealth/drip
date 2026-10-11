import React, { useState } from 'react'

import { changeDbEncryption } from '../../../db'

import AppPage from '../../common/app-page'
import AppText from '../../common/app-text'
import Segment from '../../common/segment'

import CreatePassword from './create'
import ChangePassword from './update'
import DeletePassword from './delete'

import { hasEncryptionObservable } from '../../../local-storage'
import { useTranslation } from 'react-i18next'
import { useAppControl } from '@/context/app-control-context'

const PasswordSetting = () => {
  const { restartApp } = useAppControl()
  const { t } = useTranslation(null, { keyPrefix: 'password.createPassword' })

  const isPasswordSet = hasEncryptionObservable.value
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingPassword, setIsDeletingPassword] = useState(false)

  const changeEncryptionAndRestart = async (hash) => {
    await changeDbEncryption(hash)
    // starts the app anew on Home, or shows the password prompt
    await restartApp()
  }

  return (
    <AppPage>
      <Segment title={t('title')} last>
        <AppText>
          {t(isPasswordSet ? 'textPasswordSet' : 'textPasswordNotSet')}
        </AppText>

        {!isPasswordSet && (
          <CreatePassword
            changeEncryptionAndRestart={changeEncryptionAndRestart}
          />
        )}

        {isPasswordSet && !isDeletingPassword && (
          <ChangePassword
            onStartChange={() => setIsChangingPassword(true)}
            onCancelChange={() => setIsChangingPassword(false)}
            changeEncryptionAndRestart={changeEncryptionAndRestart}
          />
        )}

        {isPasswordSet && !isChangingPassword && (
          <DeletePassword
            onStartDelete={() => setIsDeletingPassword(true)}
            onCancelDelete={() => setIsDeletingPassword(false)}
            changeEncryptionAndRestart={changeEncryptionAndRestart}
          />
        )}
      </Segment>
    </AppPage>
  )
}

export default PasswordSetting
