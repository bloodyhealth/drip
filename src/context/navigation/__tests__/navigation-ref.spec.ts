import {
  flushPendingNavigation,
  navigateWhenReady,
  navigationRef,
} from '@/context/navigation/navigation-ref'

describe('navigateWhenReady', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    flushPendingNavigation()
  })

  it('navigates right away when the navigator is ready', () => {
    // Arrange
    jest.spyOn(navigationRef, 'isReady').mockReturnValue(true)
    const navigation = jest.fn()

    // Act
    navigateWhenReady(navigation)

    // Assert
    expect(navigation).toHaveBeenCalledTimes(1)
  })

  it('waits until the navigator is ready', () => {
    // Arrange
    jest.spyOn(navigationRef, 'isReady').mockReturnValue(false)
    const navigation = jest.fn()
    navigateWhenReady(navigation)
    expect(navigation).not.toHaveBeenCalled()

    // Act
    flushPendingNavigation()

    // Assert
    expect(navigation).toHaveBeenCalledTimes(1)
  })
})
