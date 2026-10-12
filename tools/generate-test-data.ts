import { LocalDate } from '@js-joda/core'

import getNfpMucus from '../src/lib/nfp-mucus'

export type TestDataValue = string | number | boolean

export interface TestDataRow {
  [column: string]: TestDataValue | null | undefined
}

export interface TestDataOptions {
  years: number
  endDate: string
  seed?: number
}

export const CSV_COLUMNS = [
  'date',
  'temperature.value',
  'temperature.exclude',
  'temperature.time',
  'bleeding.value',
  'bleeding.exclude',
  'mucus.feeling',
  'mucus.texture',
  'mucus.value',
  'mucus.exclude',
  'cervix.opening',
  'cervix.firmness',
  'cervix.position',
  'cervix.exclude',
  'note.value',
  'desire.value',
  'sex.solo',
  'sex.partner',
  'sex.condom',
  'pain.cramps',
  'pain.headache',
  'mood.happy',
  'mood.stressed',
]

const DEFAULT_SEED = 42
const LOW_TEMPERATURE = 36.4
const HIGH_TEMPERATURE = 36.8
const DAYS_AFTER_OVULATION = 14

interface Random {
  int(min: number, max: number): number
  chance(probability: number): boolean
  around(value: number, spread: number): number
}

interface Cycle {
  length: number
  periodLength: number
  ovulationDay: number
}

function createRandom(seed: number): Random {
  let state = seed
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
  return {
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    chance: (probability) => next() < probability,
    around: (value, spread) => value + (next() - 0.5) * spread,
  }
}

function bleeding(random: Random, cycleDay: number, cycle: Cycle): TestDataRow {
  if (cycleDay > cycle.periodLength) return {}
  const value = cycleDay <= 2 ? random.int(2, 3) : random.int(0, 1)
  return { 'bleeding.value': value, 'bleeding.exclude': false }
}

function temperature(
  random: Random,
  cycleDay: number,
  cycle: Cycle
): TestDataRow {
  if (random.chance(0.1)) return {}
  const base =
    cycleDay > cycle.ovulationDay ? HIGH_TEMPERATURE : LOW_TEMPERATURE
  const minutes = String(random.int(0, 59)).padStart(2, '0')
  return {
    'temperature.value': Math.round(random.around(base, 0.2) * 100) / 100,
    'temperature.exclude': random.chance(0.03),
    'temperature.time': `0${random.int(6, 8)}:${minutes}`,
  }
}

function mucus(random: Random, cycleDay: number, cycle: Cycle): TestDataRow {
  const distance = Math.abs(cycleDay - cycle.ovulationDay)
  if (distance > 6 || random.chance(0.2)) return {}
  const feeling = distance <= 2 ? 3 : random.int(1, 2)
  const texture = distance <= 2 ? 2 : random.int(0, 1)
  return {
    'mucus.feeling': feeling,
    'mucus.texture': texture,
    'mucus.value': getNfpMucus(feeling, texture),
    'mucus.exclude': false,
  }
}

function cervix(random: Random, cycleDay: number, cycle: Cycle): TestDataRow {
  const distance = Math.abs(cycleDay - cycle.ovulationDay)
  if (distance > 5 || random.chance(0.4)) return {}
  const isOpen = distance <= 2
  return {
    'cervix.opening': isOpen ? 2 : 0,
    'cervix.firmness': isOpen ? 1 : 0,
    'cervix.position': isOpen ? 2 : 0,
    'cervix.exclude': false,
  }
}

function otherSymptoms(random: Random, cycleDay: number): TestDataRow {
  const row: TestDataRow = {}
  if (random.chance(0.1)) row['note.value'] = `note on cycle day ${cycleDay}`
  if (random.chance(0.1)) row['desire.value'] = random.int(0, 2)
  if (random.chance(0.08)) {
    row['sex.partner'] = true
    row['sex.condom'] = random.chance(0.5)
  }
  if (random.chance(0.03)) row['sex.solo'] = true
  if (cycleDay <= 2 && random.chance(0.6)) row['pain.cramps'] = true
  if (random.chance(0.05)) row['pain.headache'] = true
  if (random.chance(0.1)) row['mood.happy'] = true
  if (random.chance(0.05)) row['mood.stressed'] = true
  return row
}

function makeCycle(random: Random): Cycle {
  const length = random.int(25, 33)
  return {
    length,
    periodLength: random.int(4, 6),
    ovulationDay: length - DAYS_AFTER_OVULATION,
  }
}

function makeRow(
  random: Random,
  date: string,
  cycleDay: number,
  cycle: Cycle
): TestDataRow {
  return {
    date,
    ...bleeding(random, cycleDay, cycle),
    ...temperature(random, cycleDay, cycle),
    ...mucus(random, cycleDay, cycle),
    ...cervix(random, cycleDay, cycle),
    ...otherSymptoms(random, cycleDay),
  }
}

/** Realistic cycles from `years` before `endDate` up to `endDate`, oldest first. */
export function generateTestData({
  years,
  endDate,
  seed = DEFAULT_SEED,
}: TestDataOptions): TestDataRow[] {
  const random = createRandom(seed)
  const end = LocalDate.parse(endDate)
  let date = end.minusDays(Math.round(years * 365.25))
  const rows: TestDataRow[] = []
  while (!date.isAfter(end)) {
    const cycle = makeCycle(random)
    for (let day = 1; day <= cycle.length && !date.isAfter(end); day++) {
      rows.push(makeRow(random, date.toString(), day, cycle))
      date = date.plusDays(1)
    }
  }
  return rows
}

/** CSV in the format of the app's data import. */
export function toCsv(rows: TestDataRow[]): string {
  const lines = rows.map((row) =>
    CSV_COLUMNS.map((column) => row[column] ?? '').join(',')
  )
  return [CSV_COLUMNS.join(','), ...lines].join('\n')
}
