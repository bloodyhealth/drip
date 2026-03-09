import { Dimensions, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window')

// Always use the smaller dimension for horizontal scale,
// larger for vertical — same as the library, but explicit.
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width]

// Guideline sizes based on a standard ~5" screen (360×680 logical pixels).
// RN 0.73+ reports window dimensions more precisely (excludes system bars),
// so we use slightly smaller bases than the library's 350×680 to compensate.
const guidelineBaseWidth = 350
const guidelineBaseHeight = 680

// Normalize for pixel density so 1pt behaves consistently across densities.
// This was not in the original library and is the main fix for RN 0.73+.
const pixelRatio = PixelRatio.get()
const densityFactor = pixelRatio > 2 ? 2 / pixelRatio : 1

export const scale = (size: number): number =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      (shortDimension / guidelineBaseWidth) * size * densityFactor
    )
  )

export const verticalScale = (size: number): number =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      (longDimension / guidelineBaseHeight) * size * densityFactor
    )
  )

export const moderateScale = (size: number, factor: number = 0.5): number =>
  Math.round(
    PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor)
  )

export const moderateVerticalScale = (
  size: number,
  factor: number = 0.5
): number =>
  Math.round(
    PixelRatio.roundToNearestPixel(size + (verticalScale(size) - size) * factor)
  )

// Short aliases
export const s = scale
export const vs = verticalScale
export const ms = moderateScale
export const mvs = moderateVerticalScale
