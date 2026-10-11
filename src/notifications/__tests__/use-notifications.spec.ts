import { act, renderHook } from '@testing-library/react-native'
import notifee, {
  AuthorizationStatus,
  Event,
  EventType,
  NotificationSettings,
} from 'react-native-notify-kit'
import { useNotifications } from '@/notifications/use-notifications'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

const mockGetBleedingDaysSortedByDate = jest.fn(() => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
}))
jest.mock('@/db', () => ({
  getBleedingDaysSortedByDate: () => mockGetBleedingDaysSortedByDate(),
}))

const mockNavigate = jest.fn()
jest.mock('@/context/navigation/navigation-ref', () => ({
  navigateWhenReady: (navigation: () => void) => navigation(),
  navigationRef: { navigate: (...args: unknown[]) => mockNavigate(...args) },
}))

// prediction is computed from the db
jest.mock('@/lib/cycle', () => () => ({
  getPredictedMenses: () => [],
}))

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const withAuthorization = (authorizationStatus: AuthorizationStatus): void => {
  mockedNotifee.getNotificationSettings.mockResolvedValue({
    authorizationStatus,
  } as NotificationSettings)
}

const flushPromises = () =>
  act(() => new Promise<void>((r) => setTimeout(r, 0)))

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    withAuthorization(AuthorizationStatus.AUTHORIZED)
  })

  it('reschedules reminders when notifications are allowed', async () => {
    // Act
    renderHook(() => useNotifications())
    await flushPromises()

    // Assert
    expect(notifee.cancelNotification).toHaveBeenCalledWith('period')
    expect(notifee.cancelNotification).toHaveBeenCalledWith('temperature')
  })

  it('does not reschedule reminders when notifications are not allowed', async () => {
    // Arrange
    withAuthorization(AuthorizationStatus.DENIED)

    // Act
    renderHook(() => useNotifications())
    await flushPromises()

    // Assert
    expect(notifee.cancelNotification).not.toHaveBeenCalled()
  })

  it('sets up reminders on mount', async () => {
    // Act
    renderHook(() => useNotifications())
    await flushPromises()

    // Assert
    expect(mockGetBleedingDaysSortedByDate).toHaveBeenCalledTimes(1)
  })

  it('stops listening for reminder changes when unmounted', async () => {
    // Arrange
    const { unmount } = renderHook(() => useNotifications())
    await flushPromises()

    // Act
    unmount()

    // Assert
    const [bleedingDays] = mockGetBleedingDaysSortedByDate.mock.results
    expect(bleedingDays.value.removeListener).toHaveBeenCalledTimes(1)
  })

  it('does not request notification permission on mount', async () => {
    // Act
    renderHook(() => useNotifications())
    await flushPromises()

    // Assert
    expect(notifee.requestPermission).not.toHaveBeenCalled()
  })

  it('unsubscribes the foreground listener when unmounted early', async () => {
    // Arrange
    const unsubscribe = jest.fn()
    mockedNotifee.onForegroundEvent.mockReturnValue(unsubscribe)
    const { unmount } = renderHook(() => useNotifications())

    // Act
    unmount()
    await flushPromises()

    // Assert
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  describe('when a reminder is pressed', () => {
    const pressReminder = (id: string): void => {
      const [[listener]] = mockedNotifee.onForegroundEvent.mock.calls
      listener({
        type: EventType.PRESS,
        detail: { notification: { id } },
      } as Event)
    }

    beforeEach(() => {
      renderHook(() => useNotifications())
    })

    it('opens the temperature edit view for the temperature reminder', () => {
      // Act
      pressReminder('temperature')

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(
        'CycleDay',
        { date: expect.any(String), isTemperatureEditView: true },
        { pop: true }
      )
    })

    it('opens home for the period reminder', () => {
      // Act
      pressReminder('period')

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('Home', undefined, {
        pop: true,
      })
    })
  })
})
