import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import AppPage from '../../common/app-page'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../../i18n/constants'
import AppText from '../../common/app-text'
import { Colors, Containers, Spacing } from '../../../styles'
import { saveLanguage } from '../../../local-storage'

const Language = () => {
  const { t, i18n } = useTranslation(null, {
    keyPrefix: 'sideMenu.settings.language',
  })
  const onPress = (lang) => {
    i18n.changeLanguage(lang)
    saveLanguage(lang)
  }

  return (
    <AppPage title={t('title')}>
      {Object.values(LANGUAGES).map((lang) => {
        const isActive = lang === i18n.language
        const boxStyle = [styles.box, isActive && styles.boxActive]
        const textStyle = [styles.text, isActive && styles.textActive]
        return (
          <TouchableOpacity
            key={lang}
            onPress={() => onPress(lang)}
            style={boxStyle}
          >
            <AppText style={textStyle}>{t(`languages.${lang}`)}</AppText>
          </TouchableOpacity>
        )
      })}
    </AppPage>
  )
}

const styles = StyleSheet.create({
  box: {
    ...Containers.box,
    marginLeft: Spacing.small,
  },
  boxActive: {
    ...Containers.boxActive,
  },
  text: {
    color: Colors.orange,
  },
  textActive: {
    color: 'white',
  },
})

export default Language
