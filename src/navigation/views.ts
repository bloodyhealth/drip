import { ComponentType } from 'react'

import Home from '@/components/home'
import Calendar from '@/components/calendar'
import CycleDay from '@/components/cycle-day/cycle-day-overview'
import Chart from '@/components/chart/chart'
import SettingsMenu from '@/components/settings/settings-menu'
import settingsViews from '@/components/settings'
import Stats from '@/components/stats'

import { PageName } from './types'

/**
 * The component shown for each page. `satisfies` keeps it in sync with
 * `PageParams`: a missing page, an unknown page or a page that needs props
 * fails the typecheck.
 */
export const viewsList = {
  Home,
  Calendar,
  CycleDay,
  Chart,
  SettingsMenu,
  ...settingsViews,
  Stats,
} satisfies Record<PageName, ComponentType>
