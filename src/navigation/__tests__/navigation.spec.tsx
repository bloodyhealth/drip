import React, { ComponentType, useState } from 'react'
import { BackHandler, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { act, fireEvent, render, screen } from '@/test/test-utils'

import { Navigation } from '@/navigation/navigation'
import { navigationRef } from '@/navigation/navigation-ref'
import { PageName } from '@/navigation/types'
import { useRefreshOnFocus } from '@/navigation/use-refresh-on-focus'

jest.mock('@/navigation/views', () => ({
  get viewsList() {
    return mockScreens
  },
}))

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

const mockScreens: Record<PageName, ComponentType> = {
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
const pressBack = () => {
  let isHandled = false
  act(() => {
    isHandled = [...backHandlers].reverse().some((handler) => handler())
  })
  return isHandled
}

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
    render(<Navigation />)
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

  it('leaves going back from home to the system, which exits the app', () => {
    // Act
    const isHandled = pressBack()

    // Assert
    expect(isHandled).toBe(false)
  })

  it('does not exit the app while it can go back', () => {
    // Arrange
    pressMenuItem('Calendar')

    // Act
    const isHandled = pressBack()

    // Assert
    expect(isHandled).toBe(true)
    expect(getRouteNames()).toEqual(['Home'])
  })
})
