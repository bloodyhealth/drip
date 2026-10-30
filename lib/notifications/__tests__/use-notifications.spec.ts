import { act, renderHook } from '@testing-library/react-native'
import notifee, {
  AuthorizationStatus,
  Event,
  EventType,
  NotificationSettings,
} from 'react-native-notify-kit'
import { useNotifications } from '../use-notifications'

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
jest.mock('../../../db', () => ({
  getBleedingDaysSortedByDate: () => mockGetBleedingDaysSortedByDate(),
}))

// prediction is computed from the db
jest.mock('../../cycle', () => () => ({
  getPredictedMenses: () => [],
}))

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const withAuthorization = (authorizationStatus: AuthorizationStatus): void => {
  mockedNotifee.getNotificationSettings.mockResolvedValue({
    authorizationStatus,
  } as NotificationSettings)
}

const createActions = () => ({
  setDate: jest.fn(),
  setCurrentPage: jest.fn(),
})

const flushPromises = () =>
  act(() => new Promise<void>((r) => setTimeout(r, 0)))

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    withAuthorization(AuthorizationStatus.AUTHORIZED)
  })

  it('reschedules reminders when notifications are allowed', async () => {
    // Act
    renderHook(() => useNotifications(createActions()))
    await flushPromises()

    // Assert
    expect(notifee.cancelNotification).toHaveBeenCalledWith('period')
    expect(notifee.cancelNotification).toHaveBeenCalledWith('temperature')
  })

  it('does not reschedule reminders when notifications are not allowed', async () => {
    // Arrange
    withAuthorization(AuthorizationStatus.DENIED)

    // Act
    renderHook(() => useNotifications(createActions()))
    await flushPromises()

    // Assert
    expect(notifee.cancelNotification).not.toHaveBeenCalled()
  })

  it('sets up reminders on mount', async () => {
    // Act
    renderHook(() => useNotifications(createActions()))
    await flushPromises()

    // Assert
    expect(mockGetBleedingDaysSortedByDate).toHaveBeenCalledTimes(1)
  })

  it('stops listening for reminder changes when unmounted', async () => {
    // Arrange
    const { unmount } = renderHook(() => useNotifications(createActions()))
    await flushPromises()

    // Act
    unmount()

    // Assert
    const [bleedingDays] = mockGetBleedingDaysSortedByDate.mock.results
    expect(bleedingDays.value.removeListener).toHaveBeenCalledTimes(1)
  })

  it('does not request notification permission on mount', async () => {
    // Act
    renderHook(() => useNotifications(createActions()))
    await flushPromises()

    // Assert
    expect(notifee.requestPermission).not.toHaveBeenCalled()
  })

  it('unsubscribes the foreground listener when unmounted early', async () => {
    // Arrange
    const unsubscribe = jest.fn()
    mockedNotifee.onForegroundEvent.mockReturnValue(unsubscribe)
    const { unmount } = renderHook(() => useNotifications(createActions()))

    // Act
    unmount()
    await flushPromises()

    // Assert
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  describe('when a reminder is pressed', () => {
    let actions: ReturnType<typeof createActions>

    const pressReminder = (id: string): void => {
      const [[listener]] = mockedNotifee.onForegroundEvent.mock.calls
      listener({
        type: EventType.PRESS,
        detail: { notification: { id } },
      } as Event)
    }

    beforeEach(() => {
      actions = createActions()
      renderHook(() => useNotifications(actions))
    })

    it('opens the temperature edit view for the temperature reminder', () => {
      // Act
      pressReminder('temperature')

      // Assert
      expect(actions.setDate).toHaveBeenCalledTimes(1)
      expect(actions.setCurrentPage).toHaveBeenCalledWith('TemperatureEditView')
    })

    it('opens home for the period reminder', () => {
      // Act
      pressReminder('period')

      // Assert
      expect(actions.setDate).not.toHaveBeenCalled()
      expect(actions.setCurrentPage).toHaveBeenCalledWith('Home')
    })
  })
})
