import React from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import AppText from './app-text'
import CloseIcon from './close-icon'

import { Fonts, Spacing, Typography } from '../../styles'

const AppModal = ({ children, onClose, title }) => {
  const { top } = useSafeAreaInsets()

  return (
    <Modal onRequestClose={onClose} transparent={true} visible={true}>
      <View style={[styles.backdrop, { paddingTop: top + Spacing.base }]}>
        <View style={styles.modalWindow}>
          <View style={styles.headerContainer}>
            {title && <AppText style={styles.title}>{title}</AppText>}
            <CloseIcon onClose={onClose} />
          </View>
          {children}
        </View>
        <Pressable onPress={onClose} style={styles.outsideArea} />
      </View>
    </Modal>
  )
}

AppModal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  title: PropTypes.string,
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  modalWindow: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: Spacing.base,
    maxHeight: '70%',
    paddingBottom: Spacing.large,
  },
  outsideArea: {
    flex: 1,
  },
  title: {
    ...Typography.subtitle,
    flex: 1,
    fontFamily: Fonts.bold,
    marginRight: Spacing.base,
    marginTop: 0,
  },
})

export default AppModal
