import { LocalDate } from '@js-joda/core'

import {
  CSV_COLUMNS,
  generateTestData,
  TestDataRow,
  toCsv,
} from '../../tools/generate-test-data'
import schemas from '../db/schemas'
import getNfpMucus from '../lib/nfp-mucus'

interface ObjectSchema {
  name: string
  properties: Record<string, unknown>
}

const END_DATE = '2026-10-11'

function importableColumns(): string[] {
  const latest: ObjectSchema[] = schemas[schemas.length - 1].schema
  const byName = new Map(latest.map((s) => [s.name, s.properties]))
  const columnsOf = (name: string, prefix?: string): string[] =>
    Object.entries(byName.get(name) ?? {}).flatMap(([key, property]) => {
      const column = prefix ? `${prefix}.${key}` : key
      const objectType =
        typeof property === 'object' && property && 'objectType' in property
          ? String(property.objectType)
          : undefined
      return objectType ? columnsOf(objectType, column) : [column]
    })
  return columnsOf('CycleDay')
}

function rowsWith(rows: TestDataRow[], column: string): TestDataRow[] {
  return rows.filter((row) => row[column] !== undefined)
}

describe('generateTestData', () => {
  const rows = generateTestData({ years: 2, endDate: END_DATE })

  it('creates one row per day, ending on the given date', () => {
    // Arrange
    const first = LocalDate.parse(String(rows[0].date))

    // Act
    const last = rows[rows.length - 1].date

    // Assert
    expect(last).toBe(END_DATE)
    expect(first.plusDays(rows.length - 1).toString()).toBe(END_DATE)
    expect(rows.length).toBeGreaterThanOrEqual(2 * 365)
  })

  it('creates realistic cycles with bleeding and temperatures', () => {
    // Act
    const bleedingDays = rowsWith(rows, 'bleeding.value')
    const temperatures = rowsWith(rows, 'temperature.value').map((row) =>
      Number(row['temperature.value'])
    )

    // Assert
    expect(rows[0]['bleeding.value']).toBeDefined()
    expect(bleedingDays.length).toBeGreaterThan(rows.length / 10)
    expect(Math.min(...temperatures)).toBeGreaterThan(36)
    expect(Math.max(...temperatures)).toBeLessThan(37.2)
  })

  it('stores mucus values the way the app calculates them', () => {
    // Act
    const mucusRows = rowsWith(rows, 'mucus.value')

    // Assert
    expect(mucusRows.length).toBeGreaterThan(0)
    mucusRows.forEach((row) => {
      expect(row['mucus.value']).toBe(
        getNfpMucus(row['mucus.feeling'], row['mucus.texture'])
      )
    })
  })

  it('returns the same data for the same seed', () => {
    // Act
    const again = generateTestData({ years: 2, endDate: END_DATE })
    const otherSeed = generateTestData({ years: 2, endDate: END_DATE, seed: 7 })

    // Assert
    expect(again).toEqual(rows)
    expect(otherSeed).not.toEqual(rows)
  })
})

describe('toCsv', () => {
  it('only uses columns the import accepts', () => {
    // Act
    const header = toCsv([]).split('\n')[0].split(',')

    // Assert
    expect(header).toEqual(CSV_COLUMNS)
    header.forEach((column) => expect(importableColumns()).toContain(column))
  })

  it('writes one line per row with empty cells for missing values', () => {
    // Arrange
    const row: TestDataRow = { date: END_DATE, 'bleeding.value': 2 }

    // Act
    const [, line] = toCsv([row]).split('\n')

    // Assert
    const cells = line.split(',')
    expect(cells).toHaveLength(CSV_COLUMNS.length)
    expect(cells[CSV_COLUMNS.indexOf('date')]).toBe(END_DATE)
    expect(cells[CSV_COLUMNS.indexOf('bleeding.value')]).toBe('2')
    expect(cells[CSV_COLUMNS.indexOf('temperature.value')]).toBe('')
  })
})
