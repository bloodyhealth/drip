import { Dimensions, PixelRatio } from 'react-native'

// Match these to your design mockups
const BASE_WIDTH = 375
const BASE_HEIGHT = 812

// Keep tablets from blowing up and tiny phones from shrinking too much
const MIN_FACTOR = 0.85
const MAX_FACTOR = 1.3

export const scale = (size: number): number =>
  snap(size * getFactors().horizontal)

export const moderateScale = (size: number, factor = 0.5): number => {
  const scaled = size * getFactors().horizontal
  return snap(size + (scaled - size) * factor)
}

const clamp = (value: number) =>
  Math.min(Math.max(value, MIN_FACTOR), MAX_FACTOR)

const snap = (value: number) => PixelRatio.roundToNearestPixel(value)

// Read on every call, so values reflect the current window
// (rotation, split-screen, foldables, resizable windows).
const getFactors = () => {
  const { width, height } = Dimensions.get('window')
  const [short, long] = width < height ? [width, height] : [height, width]

  return {
    horizontal: clamp(short / BASE_WIDTH),
    vertical: clamp(long / BASE_HEIGHT),
  }
}
