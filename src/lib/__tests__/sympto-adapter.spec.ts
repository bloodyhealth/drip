import { fertilityTrackingObservable } from '../../local-storage'
import {
  getCycleStatusForDay,
  getFertilityStatusForDay,
} from '../sympto-adapter'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

const mockGetCycleForDay = jest.fn()
jest.mock('../cycle', () => () => ({
  getCycleForDay: mockGetCycleForDay,
  getCyclesBefore: jest.fn(),
  getPreviousCycle: jest.fn(),
}))

const DATE = '2026-10-21'

describe('sympto-adapter', () => {
  beforeEach(() => {
    mockGetCycleForDay.mockReturnValue(null)
  })

  it('returns no fertility status when tracking is disabled', () => {
    // Arrange
    fertilityTrackingObservable.set(false)

    // Act
    const result = getFertilityStatusForDay(DATE)

    // Assert
    expect(result).toBeUndefined()
  })

  it('returns a fertility status after tracking was enabled at runtime', () => {
    // Arrange
    fertilityTrackingObservable.set(false)
    getCycleStatusForDay(DATE)
    fertilityTrackingObservable.set(true)

    // Act
    const result = getFertilityStatusForDay(DATE)

    // Assert
    expect(result).toEqual(
      expect.objectContaining({ status: expect.any(String), phase: null })
    )
  })

  it('looks up the cycle after tracking was enabled at runtime', () => {
    // Arrange
    fertilityTrackingObservable.set(false)
    getCycleStatusForDay(DATE)
    fertilityTrackingObservable.set(true)

    // Act
    const result = getCycleStatusForDay(DATE)

    // Assert
    expect(result).toBeNull()
    expect(mockGetCycleForDay).toHaveBeenCalledWith(DATE)
  })
})
