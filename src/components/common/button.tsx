import React, { ComponentProps, ReactNode } from 'react'
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import AppIcon from './app-icon'
import AppText from './app-text'

import { Colors, Fonts, Sizes } from '@/styles'
import { moderateScale, scale } from '@/common/scale-utils'

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  children?: ReactNode
  disabled?: boolean
  iconName?: ComponentProps<typeof AppIcon>['name']
  size?: 'medium' | 'large'
  variant?: 'primary' | 'secondary'
  style?: StyleProp<ViewStyle>
}

const Button = ({
  children,
  disabled,
  iconName,
  size = 'medium',
  variant = 'primary',
  onPress,
  testID,
  style,
  ...props
}: ButtonProps) => {
  const stylesForVariant = stylesByVariant[variant]
  const stylesForSize = stylesBySize[size]

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        baseStyles.button,
        stylesForVariant.button,
        stylesForSize.button,
        pressed && baseStyles.buttonPressed,
        disabled && stylesForVariant.buttonDisabled,
        style,
      ]}
      {...props}
    >
      {({ pressed }) => (
        <>
          <AppText
            style={[
              stylesForVariant.label,
              stylesForSize.label,
              pressed && baseStyles.labelPressed,
              disabled && stylesForVariant.labelDisabled,
            ]}
          >
            {children}
          </AppText>
          {iconName && <AppIcon color={Colors.orange} name={iconName} />}
        </>
      )}
    </Pressable>
  )
}

const baseStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: scale(12),
  },
  buttonPressed: {
    opacity: 0.75,
  },
  labelPressed: {
    opacity: 0.75,
  },
})

const stylesByVariant = {
  primary: StyleSheet.create({
    button: {
      backgroundColor: Colors.orange,
    },
    buttonDisabled: {
      backgroundColor: Colors.greyLight,
    },
    label: {
      color: Colors.white,
      ...Fonts.bold,
    },
    labelDisabled: {
      color: Colors.greyDark,
    },
  }),
  secondary: StyleSheet.create({
    button: {
      borderColor: Colors.orange,
      borderWidth: 1,
    },
    buttonDisabled: {
      borderColor: Colors.greyLight,
    },
    label: {
      color: Colors.orange,
      ...Fonts.main,
    },
    labelDisabled: {
      color: Colors.grey,
    },
  }),
}

const stylesBySize = {
  medium: StyleSheet.create({
    button: {
      borderRadius: moderateScale(20),
      paddingHorizontal: scale(20),
      paddingVertical: scale(8),
    },
    label: {
      fontSize: Sizes.small,
    },
  }),
  large: StyleSheet.create({
    button: {
      borderRadius: moderateScale(25),
      paddingHorizontal: scale(28),
      paddingVertical: scale(12),
    },
    label: {
      fontSize: Sizes.base,
    },
  }),
}

export default Button
