import { useMemo } from 'react'
import { useIsFocused } from '@react-navigation/native'

/**
 * Screens stay mounted below the one on top, so without a re-render they would
 * show the data from when they were left. Pages read the db and the settings
 * while rendering, so re-rendering when the screen is shown again is enough to
 * show fresh data, and the screen keeps its state (scroll position, open
 * editors, ...).
 *
 * Read db data while rendering, not memoized once, so the re-render picks it
 * up. Where memoizing is needed, use `useMemoOnFocus`.
 */
export const useRefreshOnFocus = (): boolean => useIsFocused()

/** Like `useMemo`, but recomputes whenever the screen is shown or left. */
export const useMemoOnFocus = <T>(create: () => T): T => {
  const isFocused = useRefreshOnFocus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(create, [isFocused])
}
