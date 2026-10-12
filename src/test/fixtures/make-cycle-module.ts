import { createCycleModule } from '../../lib/cycle'
import {
  createInMemoryCycleDayRepository,
  InMemoryCycleDays,
} from './in-memory-cycle-day-repository'

export interface CycleModuleFixture extends InMemoryCycleDays {
  maxBreakInBleeding?: number
  maxCycleLength?: number
  minCyclesForPrediction?: number
}

export function makeCycleModule(fixture: CycleModuleFixture) {
  const {
    cycleDaysSortedByDate,
    bleedingDaysSortedByDate,
    cycleStartsSortedByDate,
    ...options
  } = fixture
  const repository = createInMemoryCycleDayRepository({
    cycleDaysSortedByDate,
    bleedingDaysSortedByDate,
    cycleStartsSortedByDate,
  })
  return createCycleModule(repository, options)
}
