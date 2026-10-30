import React, { ComponentType, ReactNode } from 'react'
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'

import AppIconJs from './app-icon'
import AppText from './app-text'

import { Colors, Fonts, Sizes } from '../../styles'
import { moderateScale, scale } from '../../common/scale-utils'

const AppIcon = AppIconJs as ComponentType<{
  color?: string
  name: string
  style?: StyleProp<TextStyle>
}>

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  children?: ReactNode
  iconName?: string
  isCTA?: boolean
  isSmall?: boolean
  style?: StyleProp<ViewStyle>
}

const Button = ({
  children,
  iconName,
  isCTA,
  isSmall = true,
  onPress,
  testID,
  style,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        isCTA ? styles.cta : styles.regular,
        isSmall ? styles.buttonSmall : styles.buttonLarge,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      {({ pressed }) => (
        <>
          <AppText
            style={[
              styles.buttonText,
              isCTA ? styles.buttonTextBold : styles.buttonTextRegular,
              isSmall ? styles.buttonTextSmall : styles.buttonTextLarge,
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
  buttonSmall: {
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(20),
    paddingVertical: scale(8),
  },
  buttonLarge: {
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(28),
    paddingVertical: scale(12),
  },
  regular: {},
  cta: {
    backgroundColor: Colors.orange,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    textTransform: 'uppercase',
  },
  buttonTextSmall: {
    fontSize: Sizes.small,
  },
  buttonTextLarge: {
    fontSize: Sizes.base,
  },
  buttonTextBold: {
    color: 'white',
    ...Fonts.bold,
  },
  buttonTextRegular: {
    color: Colors.greyDark,
    ...Fonts.main,
  },
  pressedText: {
    opacity: 0.75,
  },
})

export default Button
