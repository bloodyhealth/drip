import notifee, { Event, EventType } from '@notifee/react-native'
import { act, renderHook } from '@testing-library/react-native'
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

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const createActions = () => ({
  setDate: jest.fn(),
  setCurrentPage: jest.fn(),
})

const flushPromises = () =>
  act(() => new Promise<void>((r) => setTimeout(r, 0)))

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets up reminders on mount', async () => {
    // Act
    renderHook(() => useNotifications(createActions(), 1))
    await flushPromises()

    // Assert
    expect(mockGetBleedingDaysSortedByDate).toHaveBeenCalledTimes(1)
  })

  it('sets up reminders again when the db is reopened', async () => {
    // Arrange
    const actions = createActions()
    const { rerender } = renderHook(
      ({ dbSession }) => useNotifications(actions, dbSession),
      { initialProps: { dbSession: 1 } }
    )
    await flushPromises()

    // Act
    rerender({ dbSession: 2 })
    await flushPromises()

    // Assert
    expect(mockGetBleedingDaysSortedByDate).toHaveBeenCalledTimes(2)
    const [firstBleedingDays] = mockGetBleedingDaysSortedByDate.mock.results
    expect(firstBleedingDays.value.removeListener).toHaveBeenCalledTimes(1)
  })

  it('does not request notification permission on mount', async () => {
    // Act
    renderHook(() => useNotifications(createActions(), 1))
    await flushPromises()

    // Assert
    expect(notifee.requestPermission).not.toHaveBeenCalled()
  })

  it('unsubscribes the foreground listener when unmounted early', async () => {
    // Arrange
    const unsubscribe = jest.fn()
    mockedNotifee.onForegroundEvent.mockReturnValue(unsubscribe)
    const { unmount } = renderHook(() => useNotifications(createActions(), 1))

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
      renderHook(() => useNotifications(actions, 1))
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
