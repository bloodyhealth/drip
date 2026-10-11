import { getBleedingDaysSortedByDate } from '@/db'
import nothingChanged from '@/db/db-unchanged'
import {
  advanceNoticeDaysObservable,
  periodReminderObservable,
  tempReminderObservable,
} from '@/local-storage'

import { updateTemperatureReminder } from '@/notifications/temperature'
import { TemperatureReminder } from '@/notifications/types'
import { updatePeriodReminder } from '@/notifications/period'

const logError = (error: unknown): void =>
  console.error('Error updating reminder:', error)

const onPeriodInputChange = (): void => {
  updatePeriodReminder().catch(logError)
}

const onTemperatureReminderChange = (reminder: TemperatureReminder): void => {
  updateTemperatureReminder(reminder).catch(logError)
}

const onBleedingDaysChange = (_: unknown, changes: unknown): void => {
  // realm also fires on registration and without actual changes
  if (!nothingChanged(changes)) onPeriodInputChange()
}

export const refreshReminders = (): void => {
  onPeriodInputChange()
  onTemperatureReminderChange(tempReminderObservable.value)
}

export const setupReminders = (): (() => void) => {
  const bleedingDays = getBleedingDaysSortedByDate()
  bleedingDays.addListener(onBleedingDaysChange)

  const unsubscribers: (() => void)[] = [
    periodReminderObservable(onPeriodInputChange, false),
    advanceNoticeDaysObservable(onPeriodInputChange, false),
    tempReminderObservable(onTemperatureReminderChange, false),
  ]

  return () => {
    bleedingDays.removeListener(onBleedingDaysChange)
    unsubscribers.forEach((unsubscribe) => unsubscribe())
  }
}
