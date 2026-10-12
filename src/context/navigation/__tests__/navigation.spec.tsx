import React, { ComponentType, useState } from 'react'
import { BackHandler, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { act, fireEvent, render, screen } from '@/test/test-utils'

import { Navigation } from '@/context/navigation/navigation'
import { navigationRef } from '@/context/navigation/navigation-ref'
import { PageName } from '@/context/navigation/types'
import { useRefreshOnFocus } from '@/context/navigation/use-refresh-on-focus'

// the real pages are replaced by the `screens` prop below
jest.mock('@/context/navigation/views', () => ({ viewsList: {} }))

// stands in for data that pages read from the db while rendering
const mockDb = { bleedingDays: 0 }

const Placeholder = () => <View />

const CalendarScreen = () => {
  useRefreshOnFocus()
  const { navigate } = useNavigation()
  const [presses, setPresses] = useState(0)

  return (
    <>
      <Text>bleeding days {mockDb.bleedingDays}</Text>
      <Text onPress={() => setPresses(presses + 1)}>presses {presses}</Text>
      <Text onPress={() => navigate('CycleDay', { date: '2026-10-11' })}>
        open day
      </Text>
    </>
  )
}

const screens: Record<PageName, ComponentType> = {
  Home: Placeholder,
  Calendar: CalendarScreen,
  CycleDay: Placeholder,
  Chart: Placeholder,
  Stats: Placeholder,
  SettingsMenu: Placeholder,
  Reminders: Placeholder,
  Customization: Placeholder,
  DataManagement: Placeholder,
  Password: Placeholder,
  About: Placeholder,
  License: Placeholder,
  PrivacyPolicy: Placeholder,
  Language: Placeholder,
}

const backHandlers: (() => boolean | null | undefined)[] = []

// like Android: the latest listener runs first, until one handles the press
const pressBack = () =>
  act(() => {
    ;[...backHandlers].reverse().some((handler) => handler())
  })

const pressMenuItem = (label: string) =>
  act(() => fireEvent.press(screen.getByText(label)))

const getRouteNames = () =>
  navigationRef.getRootState()?.routes.map(({ name }) => name)

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    backHandlers.length = 0
    mockDb.bleedingDays = 0
    jest
      .spyOn(BackHandler, 'addEventListener')
      .mockImplementation((_, handler) => {
        backHandlers.push(handler)
        return {
          remove: () => backHandlers.splice(backHandlers.indexOf(handler), 1),
        }
      })
    jest.spyOn(BackHandler, 'exitApp').mockImplementation(() => {})
    render(<Navigation screens={screens} />)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('goes back through the history', () => {
    // Arrange
    pressMenuItem('Calendar')
    pressMenuItem('open day')

    // Act
    pressBack()

    // Assert
    expect(getRouteNames()).toEqual(['Home', 'Calendar'])
  })

  it('returns to a section already in the stack from the bottom menu', () => {
    // Arrange
    pressMenuItem('Calendar')
    pressMenuItem('Chart')

    // Act
    pressMenuItem('Calendar')

    // Assert
    expect(getRouteNames()).toEqual(['Home', 'Calendar'])
  })

  it('returns to home from the logo', () => {
    // Arrange
    pressMenuItem('Calendar')
    pressMenuItem('Stats')

    // Act
    pressMenuItem('drip.')

    // Assert
    expect(getRouteNames()).toEqual(['Home'])
  })

  it('shows fresh data and keeps the state of a screen it returns to', () => {
    // Arrange
    pressMenuItem('Calendar')
    pressMenuItem('presses 0')
    pressMenuItem('open day')
    mockDb.bleedingDays = 3

    // Act
    pressBack()

    // Assert
    expect(screen.getByText('bleeding days 3')).toBeTruthy()
    expect(screen.getByText('presses 1')).toBeTruthy()
  })

  it('exits the app when going back from home', () => {
    // Act
    pressBack()

    // Assert
    expect(BackHandler.exitApp).toHaveBeenCalledTimes(1)
  })

  it('does not exit the app while it can go back', () => {
    // Arrange
    pressMenuItem('Calendar')

    // Act
    pressBack()

    // Assert
    expect(BackHandler.exitApp).not.toHaveBeenCalled()
    expect(getRouteNames()).toEqual(['Home'])
  })
})
