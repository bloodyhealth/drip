import React, { useState } from 'react'
import { KeyboardAvoidingView, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { SHA512 } from 'jshashes'

import AppText from '../../common/app-text'
import AppTextInput from '../../common/app-text-input'
import Button from '../../common/button'

import { Colors, Spacing } from '../../../styles'
import { useTranslation } from 'react-i18next'

const EnterNewPassword = ({ changeEncryptionAndRestart }) => {
  const { t } = useTranslation()

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [hasError, setHasError] = useState(false)

  const savePassword = () => {
    if (password !== passwordConfirmation) {
      setHasError(true)
      return
    }
    const hash = new SHA512().hex(password)
    changeEncryptionAndRestart(hash)
  }

  const isButtonActive = password.length > 0 && passwordConfirmation.length > 0

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={150}>
      <AppTextInput
        onChangeText={setPassword}
        placeholder={t('password.changePassword.placeholder')}
        textContentType="password"
        value={password}
        secureTextEntry={true}
      />
      <AppTextInput
        onChangeText={setPasswordConfirmation}
        placeholder={t('password.changePassword.placeholderConfirmation')}
        textContentType="password"
        value={passwordConfirmation}
        secureTextEntry={true}
      />
      {hasError && (
        <AppText style={styles.error}>
          {t('password.changePassword.passwordsDontMatch')}
        </AppText>
      )}
      <Button
        isCTA={isButtonActive}
        disabled={!isButtonActive}
        onPress={savePassword}
      >
        {t('password.changePassword.savePassword')}
      </Button>
    </KeyboardAvoidingView>
  )
}

EnterNewPassword.propTypes = {
  changeEncryptionAndRestart: PropTypes.func,
}

const styles = StyleSheet.create({
  error: {
    color: Colors.orange,
    marginTop: Spacing.base,
  },
})

export default EnterNewPassword
