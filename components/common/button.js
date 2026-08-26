import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Pressable } from 'react-native'

import AppIcon from './app-icon'
import AppText from './app-text'

import { Colors, Fonts, Sizes } from '../../styles'
import { moderateScale, scale, verticalScale } from '../../common/scale-utils'

const Button = ({
  children,
  iconName,
  isCTA,
  isSmall,
  onPress,
  testID,
  style,
  ...props
}) => {
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

Button.propTypes = {
  children: PropTypes.node,
  iconName: PropTypes.string,
  isCTA: PropTypes.bool,
  isSmall: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  testID: PropTypes.string,
}

Button.defaultProps = {
  isSmall: true,
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(12),
  },
  buttonSmall: {
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
  },
  buttonLarge: {
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(28),
    paddingVertical: verticalScale(12),
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
    fontFamily: Fonts.bold,
  },
  buttonTextRegular: {
    color: Colors.greyDark,
    fontFamily: Fonts.main,
  },
  pressedText: {
    opacity: 0.75,
  },
})

export default Button
