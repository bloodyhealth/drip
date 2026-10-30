import AsyncStorage from '@react-native-async-storage/async-storage'

import { ADVANCE_PERIOD_NOTICE_DAYS_INIT_VALUE } from '../config'
import {
  advanceNoticeDaysObservable,
  getLanguage,
  painTrackingCategoryObservable,
  periodReminderObservable,
  saveAdvanceNoticeDays,
  savePeriodPrediction,
  saveTrackingCategory,
  tempReminderObservable,
  toAdvanceNoticeDays,
} from '../local-storage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

const mockedGetItem = jest.mocked(AsyncStorage.getItem)
const mockedSetItem = jest.mocked(AsyncStorage.setItem)

describe('local-storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('saveTrackingCategory', () => {
    it('persists the category and updates its observable', async () => {
      // Arrange
      const isTracking = false

      // Act
      await saveTrackingCategory('pain', isTracking)

      // Assert
      expect(mockedSetItem).toHaveBeenCalledWith('pain', 'false')
      expect(painTrackingCategoryObservable.value).toBe(false)
    })

    it('disables and persists the temperature reminder when temperature tracking is turned off', async () => {
      // Arrange
      tempReminderObservable.set({ enabled: true, time: '07:00' })

      // Act
      await saveTrackingCategory('temperature', false)

      // Assert
      expect(mockedSetItem).toHaveBeenCalledWith(
        'tempReminder',
        JSON.stringify({ enabled: false })
      )
      expect(tempReminderObservable.value).toEqual({ enabled: false })
    })

    it('keeps the temperature reminder when temperature tracking is turned on', async () => {
      // Arrange
      tempReminderObservable.set({ enabled: true, time: '07:00' })

      // Act
      await saveTrackingCategory('temperature', true)

      // Assert
      expect(mockedSetItem).not.toHaveBeenCalledWith(
        'tempReminder',
        expect.anything()
      )
      expect(tempReminderObservable.value).toEqual({
        enabled: true,
        time: '07:00',
      })
    })
  })

  describe('savePeriodPrediction', () => {
    it('disables and persists the period reminder when prediction is turned off', async () => {
      // Arrange
      periodReminderObservable.set({ enabled: true })

      // Act
      await savePeriodPrediction(false)

      // Assert
      expect(mockedSetItem).toHaveBeenCalledWith(
        'periodReminder',
        JSON.stringify({ enabled: false })
      )
      expect(periodReminderObservable.value).toEqual({ enabled: false })
    })
  })

  describe('getLanguage', () => {
    it('returns the stored language when it is supported', async () => {
      // Arrange
      mockedGetItem.mockResolvedValueOnce('de-DE')

      // Act
      const language = await getLanguage()

      // Assert
      expect(language).toBe('de-DE')
    })

    it('falls back to en-US when the stored language is not supported', async () => {
      // Arrange
      mockedGetItem.mockResolvedValueOnce('fr-FR')

      // Act
      const language = await getLanguage()

      // Assert
      expect(language).toBe('en-US')
    })
  })

  describe('toAdvanceNoticeDays', () => {
    it('returns a stored number unchanged', () => {
      // Arrange
      const storedValue = 3

      // Act
      const days = toAdvanceNoticeDays(storedValue)

      // Assert
      expect(days).toBe(3)
    })

    it('unwraps a legacy slider array', () => {
      // Arrange
      const storedValue = [5]

      // Act
      const days = toAdvanceNoticeDays(storedValue)

      // Assert
      expect(days).toBe(5)
    })

    it.each([[[]], ['5'], [null], [{ days: 5 }]])(
      'falls back to the default for invalid value %p',
      (storedValue) => {
        // Act
        const days = toAdvanceNoticeDays(storedValue)

        // Assert
        expect(days).toBe(ADVANCE_PERIOD_NOTICE_DAYS_INIT_VALUE)
      }
    )
  })

  describe('saveAdvanceNoticeDays', () => {
    it('persists the days as a number and updates the observable', async () => {
      // Arrange
      const days = 4

      // Act
      await saveAdvanceNoticeDays(days)

      // Assert
      expect(mockedSetItem).toHaveBeenCalledWith('advanceNoticeDays', '4')
      expect(advanceNoticeDaysObservable.value).toBe(4)
    })
  })
})
