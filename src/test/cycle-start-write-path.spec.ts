import maybeSetNewCycleStart from '../lib/set-new-cycle-start'
import {
  FixtureCycleDay,
  makeCycle,
  makeCycleDay,
  makeFixtureDb,
} from './fixtures/cycle-days'
import { makeCycleModule } from './fixtures/make-cycle-module'

const BLEEDING = { value: 2, exclude: false }

function findDay(days: FixtureCycleDay[], date: string): FixtureCycleDay {
  const day = days.find((d) => d.date === date)
  if (!day) throw new Error(`no fixture day for ${date}`)
  return day
}

function removeFromList(days: FixtureCycleDay[], day: FixtureCycleDay) {
  days.splice(days.indexOf(day), 1)
}

// Mirrors db/index.js saveSymptom for 'bleeding'. The fixture lists must
// already reflect the new bleeding value, like live Realm results do.
function saveBleeding(
  fixtureDb: ReturnType<typeof makeFixtureDb>,
  cycleDay: FixtureCycleDay,
  val: FixtureCycleDay['bleeding'] | null,
  mensesDaysAfter: FixtureCycleDay[]
) {
  const { isMensesStart } = makeCycleModule(fixtureDb)
  maybeSetNewCycleStart({
    val,
    cycleDay,
    mensesDaysAfter,
    checkIsMensesStart: isMensesStart,
  })
}

describe('cycle start write path', () => {
  test('getMensesDaysRightAfter returns the stored day objects, so they can be updated', () => {
    // Arrange
    const fixtureDb = makeFixtureDb([makeCycle('2024-01-10', 20)])
    const { getMensesDaysRightAfter } = makeCycleModule(fixtureDb)
    const start = findDay(fixtureDb.cycleDaysSortedByDate, '2024-01-10')

    // Act
    const result = getMensesDaysRightAfter(start)

    // Assert
    expect(result.map((d: FixtureCycleDay) => d.date)).toEqual([
      '2024-01-14',
      '2024-01-13',
      '2024-01-12',
      '2024-01-11',
    ])
    result.forEach((d: FixtureCycleDay) => {
      expect(d).toBe(findDay(fixtureDb.cycleDaysSortedByDate, d.date))
    })
  })

  test('adding bleeding on the day before a period moves the cycle start to that day', () => {
    // Arrange
    const dayBefore = makeCycleDay('2024-01-09', 30)
    delete dayBefore.bleeding
    const fixtureDb = makeFixtureDb([[dayBefore], makeCycle('2024-01-10', 20)])
    const oldStart = findDay(fixtureDb.cycleDaysSortedByDate, '2024-01-10')
    const { getMensesDaysRightAfter } = makeCycleModule(fixtureDb)
    const mensesDaysAfter = getMensesDaysRightAfter(dayBefore)
    dayBefore.bleeding = BLEEDING
    fixtureDb.bleedingDaysSortedByDate.splice(5, 0, dayBefore)

    // Act
    saveBleeding(fixtureDb, dayBefore, BLEEDING, mensesDaysAfter)

    // Assert
    expect(dayBefore.isCycleStart).toBe(true)
    expect(oldStart.isCycleStart).toBe(false)
  })

  test('deleting the first bleeding day moves the cycle start to the next day', () => {
    // Arrange
    const fixtureDb = makeFixtureDb([makeCycle('2024-01-10', 20)])
    const oldStart = findDay(fixtureDb.cycleDaysSortedByDate, '2024-01-10')
    const nextDay = findDay(fixtureDb.cycleDaysSortedByDate, '2024-01-11')
    const { getMensesDaysRightAfter } = makeCycleModule(fixtureDb)
    const mensesDaysAfter = getMensesDaysRightAfter(oldStart)
    removeFromList(fixtureDb.bleedingDaysSortedByDate, oldStart)

    // Act
    saveBleeding(fixtureDb, oldStart, null, mensesDaysAfter)

    // Assert
    expect(oldStart.isCycleStart).toBe(false)
    expect(nextDay.isCycleStart).toBe(true)
  })

  test('adding bleeding within an existing period does not start a new cycle', () => {
    // Arrange
    const fixtureDb = makeFixtureDb([makeCycle('2024-01-10', 20)])
    const day = findDay(fixtureDb.cycleDaysSortedByDate, '2024-01-16')
    const { getMensesDaysRightAfter } = makeCycleModule(fixtureDb)
    const mensesDaysAfter = getMensesDaysRightAfter(day)
    day.bleeding = BLEEDING
    fixtureDb.bleedingDaysSortedByDate.unshift(day)

    // Act
    saveBleeding(fixtureDb, day, BLEEDING, mensesDaysAfter)

    // Assert
    expect(day.isCycleStart).toBe(false)
  })
})
