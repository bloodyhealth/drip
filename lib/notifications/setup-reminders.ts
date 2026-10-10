import { getBleedingDaysSortedByDate } from '../../db'
import nothingChanged from '../../db/db-unchanged'
import {
  advanceNoticeDaysObservable,
  periodReminderObservable,
  tempReminderObservable,
} from '../../local-storage'
import { updatePeriodReminder } from './period'
import { updateTemperatureReminder } from './temperature'
import { TemperatureReminder } from './types'

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
