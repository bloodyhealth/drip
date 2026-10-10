export type NavigationActions = {
  setDate: (date: string) => void
  setCurrentPage: (page: string) => void
}

export type TemperatureReminder =
  | { enabled: true; time: string }
  | { enabled: false; time?: string }

export type PeriodReminder = {
  enabled: boolean
}

export type ReminderId = 'period' | 'temperature'
