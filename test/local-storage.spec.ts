import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  getLanguage,
  painTrackingCategoryObservable,
  saveTrackingCategory,
  tempReminderObservable,
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
})
