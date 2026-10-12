import { createCycleModule } from '../../lib/cycle'
import { FixtureDb } from './cycle-days'
import { createInMemoryCycleDayRepository } from './in-memory-cycle-day-repository'

export function makeDbMock(
  getFixtureDb: () => FixtureDb
): Record<string, unknown> {
  return {
    getCycleModule: () =>
      createCycleModule(createInMemoryCycleDayRepository(getFixtureDb())),
    getCycleDay: (date: string) =>
      getFixtureDb().cycleDaysSortedByDate.find((d) => d.date === date),
  }
}
