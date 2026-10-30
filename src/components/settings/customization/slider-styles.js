import { StyleSheet } from 'react-native'
import { Colors, Sizes } from '../../../styles'

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Sizes.base,
  },
  marker: {
    backgroundColor: Colors.turquoiseDark,
    borderRadius: 50,
    elevation: 4,
    height: Sizes.subtitle,
    width: Sizes.subtitle,
  },
  slider: {
    borderRadius: 25,
    height: Sizes.small,
    paddingTop: Sizes.base,
  },
  sliderAccentBackground: {
    backgroundColor: Colors.turquoiseDark,
  },
  disabledSliderAccentBackground: {
    backgroundColor: Colors.grey,
  },
  sliderBackground: {
    backgroundColor: Colors.turquoise,
  },
  disabledSliderBackground: {
    backgroundColor: Colors.greyLight,
  },
  markerOffsetY: Sizes.tiny,
})
