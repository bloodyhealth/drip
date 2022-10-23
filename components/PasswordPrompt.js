import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { SHA512 } from 'jshashes'

import AppPage from './common/app-page'
import AppTextInput from './common/app-text-input'
import Button from './common/button'
import Header from './header'

import { saveEncryptionFlag } from '../local-storage'
import { deleteDbAndOpenNew, openDb } from '../db'
import { Containers, Spacing } from '../styles'
import { useTranslation } from 'react-i18next'

const PasswordPrompt = ({ enableShowApp }) => {
  const [password, setPassword] = useState(null)

  const { t } = useTranslation()

  const cancelButton = { text: t('common:cancel'), style: 'cancel' }

  const unlockApp = async () => {
    const hash = new SHA512().hex(password)
    const connected = await openDb(hash)

    if (!connected) {
      Alert.alert(
        t('common:incorrectPassword'),
        t('common:incorrectPasswordMessage'),
        [
          {
            text: t('common:tryAgain'),
            onPress: () => setPassword(null),
          },
        ]
      )
      return
    }
    enableShowApp()
  }

  const onDeleteDataConfirmation = async () => {
    await deleteDbAndOpenNew()
    await saveEncryptionFlag(false)
    enableShowApp()
  }

  const onDeleteData = () => {
    Alert.alert(
      t('password.confirmationDialog.title'),
      t('password.confirmationDialog.text'),
      [
        cancelButton,
        {
          text: t('password.confirmationDialog.confirm'),
          onPress: onDeleteDataConfirmation,
        },
      ]
    )
  }

  const onConfirmDeletion = async () => {
    Alert.alert(
      t('password.forgotPassword'),
      t('password.forgotPasswordDialog.text'),
      [
        cancelButton,
        {
          text: t('password.forgotPasswordDialog.confirm'),
          onPress: onDeleteData,
        },
      ]
    )
  }

  return (
    <>
      <Header isStatic />
      <AppPage contentContainerStyle={styles.contentContainer}>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={150}>
          <AppTextInput
            onChangeText={setPassword}
            secureTextEntry
            placeholder={t('password.enterPassword')}
          />
          <View style={styles.containerButtons}>
            <Button onPress={onConfirmDeletion}>
              {t('password.forgotPassword')}
            </Button>
            <Button disabled={!password} isCTA={!!password} onPress={unlockApp}>
              {t('password.unlockApp')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </AppPage>
    </>
  )
}

PasswordPrompt.propTypes = {
  enableShowApp: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: Spacing.base,
  },
  containerButtons: {
    ...Containers.rowContainer,
    justifyContent: 'space-around',
  },
})

export default PasswordPrompt
