import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { SHA512 } from 'jshashes'

import AppTextInput from '../../common/app-text-input'
import Button from '../../common/button'

import { openDb } from '../../../db'
import { Containers } from '../../../styles'
import { useTranslation } from 'react-i18next'

const ConfirmWithPassword = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation()
  const [password, setPassword] = useState(null)

  const checkPassword = async () => {
    const hash = new SHA512().hex(password)
    try {
      await openDb(hash)
      onSuccess()
    } catch (err) {
      onIncorrectPassword()
    }
  }

  const onIncorrectPassword = () => {
    Alert.alert(
      t('password.incorrectPasswordDialog.title'),
      t('password.incorrectPasswordDialog.text'),
      [
        {
          text: t('shared.cancel'),
          onPress: onCancel,
        },
        {
          text: t('shared.tryAgain'),
          onPress: () => setPassword(null),
        },
      ]
    )
  }

  const isPassword = password !== null

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={150}>
      <AppTextInput
        onChangeText={setPassword}
        placeholder={t('password.unlockApp.placeholder')}
        value={password}
        secureTextEntry
      />
      <View style={styles.container}>
        <Button onPress={onCancel}>{t('shared.cancel')}</Button>
        <Button
          disabled={!isPassword}
          isCTA={isPassword}
          onPress={checkPassword}
        >
          {t('shared.confirmToProceed')}
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

ConfirmWithPassword.propTypes = {
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    ...Containers.rowContainer,
  },
})

export default ConfirmWithPassword
