import React from 'react'
import { StyleSheet, View } from 'react-native'

import AppText from '../common/app-text'
import Button from '../common/button'

import { Containers } from '../../styles'
import { useTranslation } from 'react-i18next'
import { LocalDate } from '@js-joda/core'
import { useNavigation } from '@react-navigation/native'

const NoData = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  const addDataForToday = () => {
    navigate('CycleDay', { date: LocalDate.now().toString() })
  }

  return (
    <View style={styles.container}>
      <AppText>{t('chart.noData.description')}</AppText>
      <Button onPress={addDataForToday}>{t('chart.noData.buttonText')}</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Containers.centerItems,
  },
})

export default NoData
