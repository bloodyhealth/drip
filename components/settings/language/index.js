import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import AppPage from '../../common/app-page'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from './constants'
import AppText from '../../common/app-text'

const Language = () => {
  const { t, i18n } = useTranslation(null, {
    keyPrefix: 'hamburgerMenu.settings.language',
  })

  const onPress = (lang) => {
    i18n.changeLanguage(lang)
  }
  return (
    <AppPage title={t('title')}>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity key={lang} onPress={() => onPress(lang)}>
          <AppText
            style={i18n.language === lang ? styles.languageSelected : {}}
          >
            {t(`languages.${lang}`)}
          </AppText>
        </TouchableOpacity>
      ))}
    </AppPage>
  )
}

const styles = StyleSheet.create({
  languageSelected: {
    color: 'red',
  },
})

export default Language
