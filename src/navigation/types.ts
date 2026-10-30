import { ParamListBase, RouteProp } from '@react-navigation/native'
import { ReactNode } from 'react'

/**
 * Params each page accepts. Pages without params are `undefined`.
 * Adding a page here makes it navigable and type-checks every caller.
 */
export type PageParams = {
  Home: undefined
  Calendar: undefined
  Chart: undefined
  Stats: undefined
  CycleDay: { date: string; isTemperatureEditView?: boolean }
  SettingsMenu: undefined
  Reminders: undefined
  Customization: undefined
  DataManagement: undefined
  Password: undefined
  About: undefined
  License: undefined
  PrivacyPolicy: undefined
  Language: undefined
}

export type PageName = keyof PageParams

// types `useNavigation()` and `useRoute()` everywhere in the app
declare global {
  namespace ReactNavigation {
    interface RootParamList extends PageParams {}
  }
}

export interface ScreenLayoutProps {
  children: ReactNode
  route: RouteProp<ParamListBase>
}
