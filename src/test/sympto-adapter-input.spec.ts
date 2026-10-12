import getFertilityStatus, { SymptoCycleInfo } from 'sympto'

import {
  FixtureCycleDay,
  makeCycle,
  makeFixtureDb,
} from './fixtures/cycle-days'
import { simulateDbWrite } from './fixtures/db-mock'

const NOT_FOR_SYMPTO = ['note', 'pain']

const accessedKeys = new Set<string | symbol>()

function trackAccess(day: FixtureCycleDay): FixtureCycleDay {
  return new Proxy(day, {
    get(target, key, receiver) {
      accessedKeys.add(key)
      return Reflect.get(target, key, receiver)
    },
    ownKeys(target) {
      Reflect.ownKeys(target).forEach((key) => accessedKeys.add(key))
      return Reflect.ownKeys(target)
    },
  })
}

function makeLatestCycle(): FixtureCycleDay[] {
  const days = makeCycle('2023-02-01', 20)
  days[1].bleeding = { value: 2, exclude: true }
  days[2].temperature = { value: 36.5, exclude: true }
  days[3].cervix = { opening: 1, firmness: null, position: 1, exclude: false }
  days[4].mucus = { value: null, feeling: 1, texture: null, exclude: false }
  days[5].cervix = { opening: 0, firmness: 0, position: 1, exclude: false }
  days[7].note = { value: 'private note' }
  days[7].pain = { cramps: true }
  days[8].cervix = { opening: 1, firmness: 1, position: 2, exclude: true }
  return days
}

const mockFixtureDb = makeFixtureDb([
  makeCycle('2023-01-01', 31).map(trackAccess),
  makeLatestCycle().map(trackAccess),
])

jest.mock('sympto', () =>
  jest.fn(jest.requireActual<typeof import('sympto')['default']>('sympto'))
)
jest.mock('../local-storage', () =>
  require('./fixtures/local-storage-mock').makeLocalStorageMock()
)
jest.mock('../db', () =>
  require('./fixtures/db-mock').makeDbMock(() => mockFixtureDb)
)

import { getCycleStatusForDay } from '../lib/sympto-adapter'

function symptoInput(): SymptoCycleInfo {
  getCycleStatusForDay('2023-02-03')
  const call = jest
    .mocked(getFertilityStatus)
    .mock.calls.find(([info]) => !info.excludePreOvu)
  if (!call) throw new Error('sympto was not called')
  return call[0]
}

function inputDay(date: string): object {
  const day = symptoInput().cycle.find((d) => 'date' in d && d.date === date)
  if (!day) throw new Error(`no sympto input for ${date}`)
  return day
}

describe('sympto adapter input', () => {
  beforeEach(() => {
    // Arrange
    jest.useFakeTimers({ now: new Date('2023-02-20T12:00:00Z') })
    jest.mocked(getFertilityStatus).mockClear()
    accessedKeys.clear()
    simulateDbWrite()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('passes the cycles earliest day first', () => {
    // Act
    const { cycle, previousCycle } = symptoInput()

    // Assert
    expect(cycle[0]).toMatchObject({ date: '2023-02-01' })
    expect(cycle).toHaveLength(20)
    expect(previousCycle?.[0]).toMatchObject({ date: '2023-01-01' })
  })

  test('flattens bleeding, temperature and mucus to their values', () => {
    // Act
    const day = inputDay('2023-02-01')

    // Assert
    expect(day).toMatchObject({
      date: '2023-02-01',
      bleeding: 2,
      temperature: 36.4,
      mucus: 0,
    })
  })

  test('passes complete cervix values', () => {
    // Act
    const day = inputDay('2023-02-06')

    // Assert
    expect(day).toMatchObject({ cervix: { opening: 0, firmness: 0 } })
  })

  test.each([
    ['2023-02-02', 'bleeding', 'excluded'],
    ['2023-02-03', 'temperature', 'excluded'],
    ['2023-02-04', 'cervix', 'incomplete'],
    ['2023-02-05', 'mucus', 'incomplete'],
    ['2023-02-09', 'cervix', 'excluded'],
  ])('leaves out %s %s because it is %s', (date, symptom) => {
    // Act
    const day = inputDay(date)

    // Assert
    expect(day).not.toHaveProperty(symptom)
  })

  test('does not read data sympto does not need', () => {
    // Act
    symptoInput()

    // Assert
    NOT_FOR_SYMPTO.forEach((key) => expect(accessedKeys).not.toContain(key))
  })
})
