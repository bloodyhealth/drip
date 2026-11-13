import React from 'react'
import { StyleSheet, View } from 'react-native'
import AppIcon from '../../../common/app-icon'
import { Colors, Spacing, Typography } from '../../../../styles'
import { AppText } from '../../../common/app-text'
import { Segment } from '../../../common/segment'
import { useTranslation } from 'react-i18next'

export const InfertileDaysInfo = () => {
  const { t } = useTranslation(null, {
    keyPrefix: 'sideMenu.settings.customization.infertileDaysInfo',
  })
  return (
    <Segment last>
      <View style={styles.line}>
        <AppIcon
          color={Colors.purple}
          name="info-with-circle"
          style={styles.icon}
        />
        <AppText style={styles.title}>{t('title')}</AppText>
      </View>
      <AppText>{t('note')}</AppText>
    </Segment>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: Spacing.base,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...Typography.subtitle,
  },
})
