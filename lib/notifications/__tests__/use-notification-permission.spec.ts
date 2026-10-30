import { act, renderHook } from '@testing-library/react-native'
import { AppState, AppStateStatus } from 'react-native'
import notifee, {
  AuthorizationStatus,
  NotificationSettings,
} from 'react-native-notify-kit'
import { useNotificationPermission } from '../use-notification-permission'

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const withAuthorization = (authorizationStatus: AuthorizationStatus): void => {
  mockedNotifee.getNotificationSettings.mockResolvedValue({
    authorizationStatus,
  } as NotificationSettings)
}

const flushPromises = () =>
  act(() => new Promise<void>((r) => setTimeout(r, 0)))

describe('useNotificationPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    withAuthorization(AuthorizationStatus.AUTHORIZED)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('is unknown until the permission was checked', async () => {
    // Act
    const { result } = renderHook(() => useNotificationPermission())

    // Assert
    expect(result.current.isGranted).toBeUndefined()
    await flushPromises()
    expect(result.current.isGranted).toBe(true)
  })

  it('reports a denied permission', async () => {
    // Arrange
    withAuthorization(AuthorizationStatus.DENIED)

    // Act
    const { result } = renderHook(() => useNotificationPermission())
    await flushPromises()

    // Assert
    expect(result.current.isGranted).toBe(false)
  })

  it('checks again when the app returns to the foreground', async () => {
    // Arrange
    let onAppStateChange: (state: AppStateStatus) => void = () => {}
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_, cb) => {
      onAppStateChange = cb
      return { remove: jest.fn() }
    })
    withAuthorization(AuthorizationStatus.DENIED)
    const { result } = renderHook(() => useNotificationPermission())
    await flushPromises()

    // Act
    withAuthorization(AuthorizationStatus.AUTHORIZED)
    onAppStateChange('active')
    await flushPromises()

    // Assert
    expect(result.current.isGranted).toBe(true)
  })

  it('stops listening to app state changes when unmounted', async () => {
    // Arrange
    const remove = jest.fn()
    jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove })
    const { unmount } = renderHook(() => useNotificationPermission())
    await flushPromises()

    // Act
    unmount()

    // Assert
    expect(remove).toHaveBeenCalledTimes(1)
  })

  it('updates the permission after a declined request', async () => {
    // Arrange
    withAuthorization(AuthorizationStatus.NOT_DETERMINED)
    mockedNotifee.requestPermission.mockResolvedValueOnce({
      authorizationStatus: AuthorizationStatus.DENIED,
    } as NotificationSettings)
    const { result } = renderHook(() => useNotificationPermission())
    await flushPromises()

    // Act
    let isGranted: boolean | undefined
    await act(async () => {
      isGranted = await result.current.request()
    })

    // Assert
    expect(isGranted).toBe(false)
    expect(result.current.isGranted).toBe(false)
  })
})
