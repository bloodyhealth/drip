import React from 'react'
import { StyleSheet } from 'react-native'
import AppText from '../common/app-text'

import { Spacing } from '../../styles'
import { useTranslation } from 'react-i18next'

function NoTemperature() {
  const { t } = useTranslation()
  return (
    <AppText style={styles.warning}>{t('chart.noTemperatureWarning')}</AppText>
  )
}

const styles = StyleSheet.create({
  warning: {
    padding: Spacing.large,
  },
})

export default NoTemperature
