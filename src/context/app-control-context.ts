import { createContext, useContext } from 'react'

export interface AppControl {
  /** Reopens the db and shows the password prompt if it is encrypted. */
  restartApp: () => Promise<void>
}

export const AppControlContext = createContext<AppControl | null>(null)

export const useAppControl = (): AppControl => {
  const control = useContext(AppControlContext)

  if (!control) {
    throw new Error('useAppControl must be used within AppControlContext')
  }

  return control
}
