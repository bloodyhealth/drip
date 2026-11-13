import { Insets, PixelRatio } from 'react-native'
import { scale } from './common/scale-utils'

export const SYMPTOMS = [
  'bleeding',
  'temperature',
  'mucus',
  'cervix',
  'sex',
  'desire',
  'pain',
  'mood',
  'note',
] as const

export type Symptom = (typeof SYMPTOMS)[number]

export const CHART_COLUMN_WIDTH = 32
export const CHART_COLUMN_MIDDLE = CHART_COLUMN_WIDTH / 2
export const CHART_DOT_RADIUS_SYMPTOM = scale(6)
export const CHART_DOT_RADIUS_TEMPERATURE = scale(4)
export const CHART_GRID_LINE_HORIZONTAL_WIDTH =
  PixelRatio.roundToNearestPixel(0.3)
export const CHART_ICON_SIZE = scale(20)
export const CHART_STROKE_WIDTH = scale(1.5)
export const CHART_SYMPTOM_HEIGHT_RATIO = 0.06
export const CHART_X_AXIS_HEIGHT_RATIO = 0.1
export const CHART_Y_AXIS_WIDTH = scale(32)
export const CHART_TICK_WIDTH = scale(44)

export const TEMP_SCALE_MAX = 37.5
export const TEMP_SCALE_MIN = 35.5
export const TEMP_SCALE_UNITS = 0.1
export const TEMP_MAX = 39
export const TEMP_MIN = 35
export const TEMP_SLIDER_STEP = 0.5

export const ADVANCE_PERIOD_NOTICE_DAYS_MIN = 1
export const ADVANCE_PERIOD_NOTICE_DAYS_MAX = 7
export const ADVANCE_PERIOD_NOTICE_DAYS_INIT_VALUE = 3

export const HIT_SLOP: Insets = {
  top: scale(20),
  bottom: scale(20),
  left: scale(20),
  right: scale(20),
}
