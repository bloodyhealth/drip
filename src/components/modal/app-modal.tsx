import React, { ComponentType, ReactNode } from 'react'
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { AppText } from '@/components/common/app-text'
import CloseIconJs from '@/components/common/close-icon'
import { IconButton } from '@/components/button/icon-button'

import { HIT_SLOP } from '@/config'
import { Sizes, Spacing, Typography } from '../../styles'

const TITLE_LINE_HEIGHT = Math.round(Sizes.subtitle * 1.3)

interface AppModalProps {
  children?: ReactNode
  onClose: () => void
  onBack?: () => void
  onHardwareBackPress?: () => void
  onInfo?: () => void
  title?: string
}

export const AppModal = ({
  children,
  onBack,
  onClose,
  onHardwareBackPress = onClose,
  onInfo,
  title,
}: AppModalProps) => {
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets()

  return (
    <Modal onRequestClose={onHardwareBackPress} transparent visible>
      <View style={[styles.backdrop, { paddingTop: top + Spacing.base }]}>
        <View style={styles.modalWindow}>
          <View style={styles.headerContainer}>
            {onBack && (
              <View style={styles.backButton}>
                <IconButton
                  accessibilityLabel={t('modalWithInfo.back')}
                  name="chevron-left"
                  onPress={onBack}
                />
              </View>
            )}
            <View style={styles.titleRow}>
              {title && <AppText style={styles.title}>{title}</AppText>}
              {onInfo && (
                <View style={styles.infoButton}>
                  <IconButton
                    accessibilityLabel={t('modalWithInfo.showInfo')}
                    hitSlop={{ ...HIT_SLOP, right: 0 }}
                    name="info"
                    onPress={onInfo}
                    variant="outlined"
                  />
                </View>
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

const CloseIcon = CloseIconJs as ComponentType<{
  onClose: () => void
  style?: StyleProp<ViewStyle>
}>

const styles = StyleSheet.create({
  backButton: {
    height: TITLE_LINE_HEIGHT,
    justifyContent: 'center',
    marginRight: 'auto',
    paddingRight: Spacing.base,
  },
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
  infoButton: {
    height: TITLE_LINE_HEIGHT,
    justifyContent: 'center',
    marginLeft: Spacing.small,
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
  titleRow: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    marginRight: Spacing.large,
  },
})
