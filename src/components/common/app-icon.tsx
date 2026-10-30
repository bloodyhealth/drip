import React, { ComponentProps } from 'react'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
import { Entypo as Icon } from '@react-native-vector-icons/entypo/static'

import { Sizes } from '../../styles'

interface AppIconProps extends Omit<ComponentProps<typeof Icon>, 'style'> {
  color?: string
  style?: StyleProp<TextStyle>
}

const AppIcon = ({ color = 'black', name, style, ...props }: AppIconProps) => {
  const iconStyle = [styles.icon, style, { color }]

  return <Icon name={name} style={iconStyle} {...props} />
}

const styles = StyleSheet.create({
  icon: {
    fontSize: Sizes.subtitle,
  },
})

export default AppIcon
