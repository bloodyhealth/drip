import React from 'react'
import { Text } from 'react-native'
import RNRestart from 'react-native-restart'

import { ErrorBoundary } from '../components/common/error-boundary'
import { fireEvent, render, screen } from './test-utils'

const CHILD_TEXT = 'child content'

let shouldThrow = true

const ThrowingChild = () => {
  if (shouldThrow) throw new Error('boom')
  return <Text>{CHILD_TEXT}</Text>
}

const renderBoundaryWithError = (): void => {
  render(
    <ErrorBoundary>
      <ThrowingChild />
    </ErrorBoundary>
  )
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.clearAllMocks()
    shouldThrow = true
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows the error view with retry and restart buttons', () => {
    // Arrange & Act
    renderBoundaryWithError()

    // Assert
    expect(screen.getByText('Something went wrong')).toBeTruthy()
    expect(screen.getByText('Try again')).toBeTruthy()
    expect(screen.getByText('Restart app')).toBeTruthy()
  })

  it('restarts the app when pressing restart', () => {
    // Arrange
    renderBoundaryWithError()

    // Act
    fireEvent.press(screen.getByText('Restart app'))

    // Assert
    expect(RNRestart.restart).toHaveBeenCalledTimes(1)
  })

  it('renders the children again when pressing retry', () => {
    // Arrange
    renderBoundaryWithError()
    shouldThrow = false

    // Act
    fireEvent.press(screen.getByText('Try again'))

    // Assert
    expect(screen.getByText(CHILD_TEXT)).toBeTruthy()
    expect(RNRestart.restart).not.toHaveBeenCalled()
  })
})
