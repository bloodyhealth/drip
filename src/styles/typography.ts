import { TextStyle } from 'react-native'

import Colors from './colors'
import Spacing from './spacing'
import { scale } from '../common/scale-utils'

const FONT_FAMILY = 'Jost'

export const fonts = {
  main: { fontFamily: FONT_FAMILY, fontWeight: '400' },
  bold: { fontFamily: FONT_FAMILY, fontWeight: '700' },
} as const satisfies Record<string, TextStyle>

export const sizes = {
  tiny: scale(7),
  footnote: scale(10),
  small: scale(13),
  base: scale(16),
  subtitle: scale(22),
  title: scale(24),
  huge: scale(32),
  icon: scale(40),
} as const

const accentText = {
  ...fonts.bold,
  textAlignVertical: 'center',
  textTransform: 'uppercase',
} satisfies TextStyle

const accentTextBig = {
  ...accentText,
  fontSize: scale(30),
} satisfies TextStyle

const accentTextGiant = {
  ...accentText,
  fontSize: sizes.icon,
} satisfies TextStyle

const accentTextHuge = {
  ...accentText,
  fontSize: sizes.huge,
} satisfies TextStyle

const accentTextSmall = {
  ...accentText,
  fontSize: sizes.small,
} satisfies TextStyle

const title = {
  color: Colors.purple,
  marginVertical: Spacing.large,
} satisfies TextStyle

const label = {
  fontSize: sizes.small,
  textTransform: 'uppercase',
} satisfies TextStyle

export default {
  accentOrange: {
    ...accentTextSmall,
    color: Colors.orange,
  },
  accentPurpleBig: {
    ...accentTextBig,
    color: Colors.purple,
  },
  accentPurpleGiant: {
    ...accentTextGiant,
    color: Colors.purple,
  },
  accentPurpleHuge: {
    ...accentTextHuge,
    color: Colors.purple,
  },
  mainText: {
    ...fonts.main,
    fontSize: sizes.base,
  },
  label: {
    ...label,
  },
  labelBold: {
    color: Colors.greyDark,
    fontWeight: 'bold',
    ...label,
  },
  labelLight: {
    color: Colors.grey,
    fontSize: sizes.footnote,
  },
  subtitle: {
    fontSize: sizes.subtitle,
    ...title,
  },
  title: {
    alignSelf: 'center',
    ...fonts.bold,
    fontSize: sizes.title,
    marginHorizontal: Spacing.base,
    ...title,
  },
  titleWithoutMargin: {
    alignSelf: 'center',
    color: Colors.purple,
    ...fonts.bold,
    fontSize: sizes.title,
  },
} satisfies Record<string, TextStyle>
