import { makeCycle, makeFixtureDb } from './fixtures/cycle-days'
import { simulateDbWrite } from './fixtures/db-mock'

const mockFixtureDb = makeFixtureDb([
  makeCycle('2023-01-01', 31),
  makeCycle('2023-02-01', 20),
])

jest.mock('../local-storage', () =>
  require('./fixtures/local-storage-mock').makeLocalStorageMock()
)
jest.mock('../db', () =>
  require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb)
)

import { fertilityTrackingObservable } from '../local-storage'
import {
  getCycleStatusForDay,
  getFertilityStatusForDay,
} from '../lib/sympto-adapter'

const TODAY = '2023-02-20'

describe('fertility tracking setting', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date(`${TODAY}T12:00:00Z`) })
    simulateDbWrite()
  })

  afterEach(() => {
    fertilityTrackingObservable.value = true
    jest.useRealTimers()
  })

  test('shows no fertility status after tracking was turned off', () => {
    // Arrange
    getFertilityStatusForDay(TODAY)

    // Act
    fertilityTrackingObservable.value = false

    // Assert
    expect(getFertilityStatusForDay(TODAY)).toBeUndefined()
    expect(getCycleStatusForDay(TODAY)).toBeUndefined()
  })

  test('shows the fertility status after tracking was turned on', () => {
    // Arrange
    fertilityTrackingObservable.value = false
    getFertilityStatusForDay(TODAY)

    // Act
    fertilityTrackingObservable.value = true

    // Assert
    expect(getFertilityStatusForDay(TODAY)).toMatchObject({ phase: 3 })
  })
})
