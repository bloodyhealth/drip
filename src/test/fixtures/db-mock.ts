import { createCycleModule } from '../../lib/cycle'
import { FixtureDb } from './cycle-days'
import { createInMemoryCycleDayRepository } from './in-memory-cycle-day-repository'

let dataVersion = 0

// Stands in for a write through the db module, which bumps the data version.
export function simulateDbWrite(): void {
  dataVersion++
}

export function makeDbMock(
  getFixtureDb: () => FixtureDb
): Record<string, unknown> {
  return {
    getCycleModule: () =>
      createCycleModule(createInMemoryCycleDayRepository(getFixtureDb())),
    getCycleDay: (date: string) =>
      getFixtureDb().cycleDaysSortedByDate.find((d) => d.date === date),
    getDataVersion: () => dataVersion,
  }
}
