/// <reference types="node" />
import { writeFileSync } from 'node:fs'
import { LocalDate } from '@js-joda/core'

import { generateTestData, toCsv } from '../generate-test-data'

const years = Number(process.argv[2] ?? 10)
if (!(years > 0)) {
  process.stderr.write('Usage: generate-test-data [years] [output.csv]\n')
  process.exit(1)
}

const outPath = process.argv[3] ?? `drip-test-data-${years}y.csv`
const endDate = LocalDate.now().minusDays(1).toString()
const rows = generateTestData({ years, endDate })

writeFileSync(outPath, toCsv(rows))
process.stdout.write(`Wrote ${rows.length} days to ${outPath}\n`)
