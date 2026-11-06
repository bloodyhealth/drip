import React, { ComponentProps } from 'react'
import { Pressable, PressableProps, StyleSheet, View } from 'react-native'

import AppIcon from '@/components/common/app-icon'

import { HIT_SLOP } from '@/config'
import { Colors, Sizes } from '@/styles'

interface IconButtonProps {
  accessibilityLabel: string
  hitSlop?: PressableProps['hitSlop']
  name: ComponentProps<typeof AppIcon>['name']
  onPress: () => void
  variant?: 'plain' | 'outlined'
}

export const IconButton = ({
  accessibilityLabel,
  hitSlop = HIT_SLOP,
  name,
  onPress,
  variant = 'plain',
}: IconButtonProps) => (
  <Pressable
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    hitSlop={hitSlop}
    onPress={onPress}
    style={({ pressed }) => pressed && styles.pressed}
  >
    {variant === 'outlined' ? (
      <View style={styles.outline}>
        <AppIcon
          color={Colors.orange}
          name={name}
          style={styles.outlinedIcon}
        />
      </View>
    ) : (
      <AppIcon color={Colors.orange} name={name} />
    )}
  </Pressable>
)

const styles = StyleSheet.create({
  outline: {
    alignItems: 'center',
    borderColor: Colors.orange,
    borderRadius: '50%',
    borderWidth: 1.5,
    height: Sizes.subtitle,
    justifyContent: 'center',
    width: Sizes.subtitle,
  },
  outlinedIcon: {
    fontSize: Sizes.subtitle * 0.6,
  },
  pressed: {
    opacity: 0.75,
  },
})
