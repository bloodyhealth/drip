import React from 'react'
import { Alert, AlertButton, Modal } from 'react-native'
import { act, fireEvent, render, screen } from '@/test/test-utils'

import SymptomEditView from '@/components/cycle-day/symptom-edit-view'
import { saveSymptom } from '@/db'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))
jest.mock('react-native-simple-toast', () => ({ show: jest.fn() }))
jest.mock('@/db', () => ({
  mapRealmObjToJsObj: jest.fn(),
  saveSymptom: jest.fn(),
}))

const DATE = '2026-10-17'

const buildTemperature = (value: number | null = null) => ({
  exclude: false,
  note: null,
  time: null,
  value,
})

const renderTemperatureView = (symptomData = buildTemperature()) => {
  const onClose = jest.fn()
  render(
    <SymptomEditView
      date={DATE}
      onClose={onClose}
      symptom="temperature"
      symptomData={symptomData}
    />
  )
  return { onClose }
}

const requestClose = () =>
  act(() => screen.UNSAFE_getByType(Modal).props.onRequestClose())

const pressAlertButton = (index: number) => {
  const buttons = (Alert.alert as jest.Mock).mock.calls[0][2] as AlertButton[]
  act(() => buttons[index].onPress?.())
}

describe('SymptomEditView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn())
  })

  it('closes without warning or saving when nothing changed', () => {
    // Arrange
    const { onClose } = renderTemperatureView(buildTemperature(36.5))

    // Act
    requestClose()

    // Assert
    expect(Alert.alert).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
    expect(saveSymptom).not.toHaveBeenCalled()
  })

  it('does not prefill the temperature input', () => {
    // Arrange
    renderTemperatureView()

    // Assert
    expect(screen.getByTestId('temperatureInput').props.value).toBeFalsy()
  })

  it('warns and keeps the modal open when closing with changes', () => {
    // Arrange
    const { onClose } = renderTemperatureView()
    fireEvent.changeText(screen.getByTestId('temperatureInput'), '36.7')

    // Act
    requestClose()
    pressAlertButton(0)

    // Assert
    expect(Alert.alert).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
    expect(saveSymptom).not.toHaveBeenCalled()
  })

  it('discards changes when confirming the warning', () => {
    // Arrange
    const { onClose } = renderTemperatureView()
    fireEvent.changeText(screen.getByTestId('temperatureInput'), '36.7')

    // Act
    requestClose()
    pressAlertButton(1)

    // Assert
    expect(onClose).toHaveBeenCalled()
    expect(saveSymptom).not.toHaveBeenCalled()
  })

  it('saves the typed temperature without blurring the input', () => {
    // Arrange
    renderTemperatureView()
    fireEvent.changeText(screen.getByTestId('temperatureInput'), '36.7')

    // Act
    fireEvent.press(screen.getByText('Save'))

    // Assert
    expect(saveSymptom).toHaveBeenCalledWith(
      'temperature',
      DATE,
      expect.objectContaining({ value: 36.7 })
    )
  })

  it('does not warn after typing and clearing the temperature', () => {
    // Arrange
    const { onClose } = renderTemperatureView()
    const input = screen.getByTestId('temperatureInput')
    fireEvent.changeText(input, '36.7')
    fireEvent.changeText(input, '')

    // Act
    requestClose()

    // Assert
    expect(Alert.alert).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
