import React from 'react'
import { Alert, AlertButton, Linking } from 'react-native'
import notifee, {
  AuthorizationStatus,
  NotificationSettings,
} from 'react-native-notify-kit'
import Reminders from '../components/settings/reminders/reminders'
import {
  periodPredictionObservable,
  periodReminderObservable,
  tempReminderObservable,
  temperatureTrackingCategoryObservable,
} from '../local-storage'
import { act, fireEvent, render, screen } from './test-utils'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

jest.mock('@ptomasroos/react-native-multi-slider', () => 'MultiSlider')

const DIALOG_TITLE = 'Notifications are turned off'

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const withAuthorization = (authorizationStatus: AuthorizationStatus): void => {
  mockedNotifee.getNotificationSettings.mockResolvedValue({
    authorizationStatus,
  } as NotificationSettings)
}

const flushPromises = () =>
  act(() => new Promise<void>((r) => setTimeout(r, 0)))

const renderReminders = async (): Promise<void> => {
  render(<Reminders />)
  await flushPromises()
}

const dialogCalls = (): unknown[][] =>
  jest
    .mocked(Alert.alert)
    .mock.calls.filter(([title]) => title === DIALOG_TITLE)

describe('Reminders', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    periodPredictionObservable.set(true)
    temperatureTrackingCategoryObservable.set(true)
    periodReminderObservable.set({ enabled: false })
    tempReminderObservable.set({ enabled: false })
    withAuthorization(AuthorizationStatus.DENIED)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('does not show the dialog on open while no reminder is on', async () => {
    // Act
    await renderReminders()

    // Assert
    expect(dialogCalls()).toHaveLength(0)
  })

  it('shows the dialog on open when a reminder is on but notifications are not allowed', async () => {
    // Arrange
    tempReminderObservable.set({ enabled: true, time: '08:00' })

    // Act
    await renderReminders()

    // Assert
    expect(dialogCalls()).toHaveLength(1)
  })

  it('does not show the dialog when notifications are allowed', async () => {
    // Arrange
    withAuthorization(AuthorizationStatus.AUTHORIZED)
    periodReminderObservable.set({ enabled: true })

    // Act
    await renderReminders()

    // Assert
    expect(dialogCalls()).toHaveLength(0)
  })

  it('shows the dialog and keeps the reminder off after the permission was declined', async () => {
    // Arrange
    mockedNotifee.requestPermission.mockResolvedValueOnce({
      authorizationStatus: AuthorizationStatus.DENIED,
    } as NotificationSettings)
    await renderReminders()
    const [periodSwitch] = screen.getAllByRole('switch')

    // Act
    fireEvent(periodSwitch, 'valueChange', true)
    await flushPromises()

    // Assert
    expect(dialogCalls()).toHaveLength(1)
    expect(periodReminderObservable.value.enabled).toBe(false)
  })

  it('opens the device settings from the dialog', async () => {
    // Arrange
    const openSettings = jest
      .spyOn(Linking, 'openSettings')
      .mockResolvedValue(undefined)
    periodReminderObservable.set({ enabled: true })
    await renderReminders()
    const [, , buttons] = dialogCalls()[0] as [string, string, AlertButton[]]
    const openSettingsButton = buttons.find(
      ({ text }) => text === 'Open settings'
    )

    // Act
    openSettingsButton?.onPress?.()

    // Assert
    expect(openSettings).toHaveBeenCalledTimes(1)
  })
})
