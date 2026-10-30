import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import AppText from '../common/app-text'
import Button from '../common/button'

import { Containers } from '../../styles'
import { useTranslation } from 'react-i18next'

const NoData = ({ navigate }) => {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <AppText>{t('chart.noData.description')}</AppText>
      <Button
        isCTA
        onPress={() => {
          navigate('CycleDay')
        }}
      >
        {t('chart.noData.buttonText')}
      </Button>
    </View>
  )
}

NoData.propTypes = {
  navigate: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    ...Containers.centerItems,
  },
})

export default NoData
