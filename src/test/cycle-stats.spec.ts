import { makeCycle, makeFixtureDb } from './fixtures/cycle-days'
import { makeCycleModule } from './fixtures/make-cycle-module'

const fixtureDb = makeFixtureDb([
  makeCycle('2024-01-01', 28),
  makeCycle('2024-01-29', 30),
  makeCycle('2024-02-28', 26),
  makeCycle('2024-03-25', 17),
])

describe('cycle stats', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date('2024-04-10T12:00:00Z') })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('getAllCycleLengths returns the lengths of all completed cycles, newest first', () => {
    // Arrange
    const { getAllCycleLengths } = makeCycleModule(fixtureDb)

    // Act
    const result = getAllCycleLengths()

    // Assert
    expect(result).toEqual([26, 30, 28])
  })

  test('getStats returns start, cycle length and bleeding length per cycle, newest first', () => {
    // Arrange
    const { getStats } = makeCycleModule(fixtureDb)

    // Act
    const result = getStats()

    // Assert
    expect(result).toEqual([
      { date: '2024-03-25', cycleLength: 17, bleedingLength: 5 },
      { date: '2024-02-28', cycleLength: 26, bleedingLength: 5 },
      { date: '2024-01-29', cycleLength: 30, bleedingLength: 5 },
      { date: '2024-01-01', cycleLength: 28, bleedingLength: 5 },
    ])
  })

  test('getStats counts bleeding days after a one-day break as part of the same period', () => {
    // Arrange
    const cycle = makeCycle('2024-03-25', 17)
    cycle[6].bleeding = { value: 1, exclude: false }
    const { getStats } = makeCycleModule(makeFixtureDb([cycle]))

    // Act
    const [result] = getStats()

    // Assert
    expect(result.bleedingLength).toBe(6)
  })
})
