import React, { ReactNode, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { AppModal } from '@/components/modal/app-modal'

import { Spacing } from '@/styles'

interface ModalWithInfoProps {
  children?: ReactNode
  infoContent: ReactNode
  infoTitle: string
  onClose: () => void
  onHardwareBackPress?: () => void
  title: string
}

export const ModalWithInfo = ({
  children,
  infoContent,
  infoTitle,
  onClose,
  onHardwareBackPress = onClose,
  title,
}: ModalWithInfoProps) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false)

  const hideInfo = () => setIsInfoVisible(false)
  const showInfo = () => setIsInfoVisible(true)

  return (
    <AppModal
      onBack={isInfoVisible ? hideInfo : undefined}
      onClose={onClose}
      onHardwareBackPress={isInfoVisible ? hideInfo : onHardwareBackPress}
      onInfo={isInfoVisible ? undefined : showInfo}
      title={isInfoVisible ? infoTitle : title}
    >
      {isInfoVisible ? (
        <ScrollView contentContainerStyle={styles.infoContainer}>
          {infoContent}
        </ScrollView>
      ) : (
        children
      )}
    </AppModal>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: Spacing.base,
  },
})
