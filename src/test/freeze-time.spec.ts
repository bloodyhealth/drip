import { LocalDateTime } from '@js-joda/core'
import { freezeTime, unfreezeTime } from './freeze-time'

describe('freezeTime', () => {
  afterEach(() => {
    unfreezeTime()
  })

  it('controls the current time of Date and js-joda', () => {
    // Arrange
    const frozen = '2025-01-15T09:00:00+01:00'

    // Act
    freezeTime(frozen)

    // Assert
    expect(Date.now()).toBe(new Date(frozen).getTime())
    expect(LocalDateTime.now().toString()).toBe('2025-01-15T09:00')
  })
})
