import React from 'react'
import { StyleSheet, View } from 'react-native'
import AppIcon from '../../../common/app-icon'
import { Colors, Spacing, Typography } from '../../../../styles'
import AppText from '../../../common/app-text'
import Segment from '../../../common/segment'
import { Trans, useTranslation } from 'react-i18next'
import links from '../../../../common/links'
import AppLink from '../../../common/AppLink'

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
      <AppText>
        <Trans
          t={t}
          i18nKey="note"
          components={[<AppLink key={links.wiki.url} url={links.wiki.url} />]}
          values={{ urlText: links.wiki.text }}
        />
      </AppText>
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
