import React, { ComponentType, ReactNode } from 'react'
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import AppTextJs from './app-text'
import CloseIconJs from './close-icon'

import { Sizes, Spacing, Typography } from '../../styles'

const TITLE_LINE_HEIGHT = Math.round(Sizes.subtitle * 1.3)

interface AppModalProps {
  children?: ReactNode
  headerLeft?: ReactNode
  onClose: () => void
  onRequestClose?: () => void
  title?: string
  titleAccessory?: ReactNode
}

export const AppModal = ({
  children,
  headerLeft,
  onClose,
  onRequestClose = onClose,
  title,
  titleAccessory,
}: AppModalProps) => {
  const { top } = useSafeAreaInsets()

  return (
    <Modal onRequestClose={onRequestClose} transparent={true} visible={true}>
      <View style={[styles.backdrop, { paddingTop: top + Spacing.base }]}>
        <View style={styles.modalWindow}>
          <View style={styles.headerContainer}>
            {headerLeft && <View style={styles.headerLeft}>{headerLeft}</View>}
            <View style={styles.titleRow}>
              {title && <AppText style={styles.title}>{title}</AppText>}
              {titleAccessory && (
                <View style={styles.titleAccessory}>{titleAccessory}</View>
              )}
            </View>
            <CloseIcon onClose={onClose} style={styles.closeIcon} />
          </View>
          {children}
        </View>
        <Pressable onPress={onClose} style={styles.outsideArea} />
      </View>
    </Modal>
  )
}

const AppText = AppTextJs as ComponentType<{
  children?: ReactNode
  style?: StyleProp<TextStyle>
}>
const CloseIcon = CloseIconJs as ComponentType<{
  onClose: () => void
  style?: StyleProp<ViewStyle>
}>

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  closeIcon: {
    height: TITLE_LINE_HEIGHT,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'flex-start',

    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.large,
    paddingTop: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  headerLeft: {
    height: TITLE_LINE_HEIGHT,
    justifyContent: 'center',
    marginRight: 'auto',
    paddingRight: Spacing.base,
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
    flexShrink: 1,
    lineHeight: TITLE_LINE_HEIGHT,
    marginVertical: 0,
  },
  titleAccessory: {
    height: TITLE_LINE_HEIGHT,
    justifyContent: 'center',
    marginLeft: Spacing.small,
  },
  titleRow: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    marginRight: Spacing.large,
  },
})
