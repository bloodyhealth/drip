import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Linking } from 'react-native'

import AppPage from '../common/app-page'
import AppText from '../common/app-text'
import Segment from '../common/segment'

import { Colors } from '../../styles'

const License = ({ children }) => {
  const { t } = useTranslation(null, { keyPrefix: 'settings.license' })
  const currentYear = new Date().getFullYear()
  const link = 'https://www.gnu.org/licenses/gpl-3.0.html'
  return (
    <AppPage title={t('title')}>
      <Segment last>
        <AppText>{t('text', { currentYear })}</AppText>
        <AppText style={styles.link} onPress={() => Linking.openURL(link)}>
          {link}
        </AppText>
        {children}
      </Segment>
    </AppPage>
  )
}

License.propTypes = {
  children: PropTypes.node,
}

const styles = StyleSheet.create({
  link: {
    color: Colors.purple,
    textDecorationLine: 'underline',
  },
})

export default License
