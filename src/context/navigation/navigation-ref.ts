import { createNavigationContainerRef } from '@react-navigation/native'

import { PageParams } from './types'

export const navigationRef = createNavigationContainerRef<PageParams>()

let pendingNavigation: (() => void) | undefined

/**
 * Navigates from outside the navigator, e.g. for a pressed notification.
 * Before the navigator is ready (a notification pressed on a cold start), the
 * navigation waits until `flushPendingNavigation` runs.
 */
export const navigateWhenReady = (navigation: () => void): void => {
  if (navigationRef.isReady()) {
    navigation()
    return
  }

  pendingNavigation = navigation
}

export const flushPendingNavigation = (): void => {
  const navigation = pendingNavigation
  pendingNavigation = undefined
  navigation?.()
}
