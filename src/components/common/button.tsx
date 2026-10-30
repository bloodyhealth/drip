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

import { Colors, Fonts, Sizes } from '../../styles'
import { moderateScale, scale } from '../../common/scale-utils'

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
  const isLarge = size === 'large'
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        isLarge ? styles.buttonLarge : styles.buttonMedium,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {({ pressed }) => (
        <>
          <AppText
            style={[
              styles.buttonText,
              isPrimary ? styles.buttonTextPrimary : styles.buttonTextSecondary,
              isLarge ? styles.buttonTextLarge : styles.buttonTextMedium,
              pressed && styles.pressedText,
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

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: scale(12),
  },
  buttonMedium: {
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(20),
    paddingVertical: scale(8),
  },
  buttonLarge: {
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(28),
    paddingVertical: scale(12),
  },
  secondary: {},
  primary: {
    backgroundColor: Colors.orange,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.4,
  },
  buttonText: {
    textTransform: 'uppercase',
  },
  buttonTextMedium: {
    fontSize: Sizes.small,
  },
  buttonTextLarge: {
    fontSize: Sizes.base,
  },
  buttonTextPrimary: {
    color: 'white',
    ...Fonts.bold,
  },
  buttonTextSecondary: {
    color: Colors.greyDark,
    ...Fonts.main,
  },
  pressedText: {
    opacity: 0.75,
  },
})

export default Button
