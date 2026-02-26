import {
  formatDateForShortText,
  dateToTitle,
  humanizeDate,
} from '../components/helpers/format-date'
import { LocalDate } from '@js-joda/core'
import '../i18n/i18n'

// Mock LocalDate.now() to return a fixed date
jest.spyOn(LocalDate, 'now').mockReturnValue(LocalDate.parse('2024-01-15'))

describe('formatDateForShortText', () => {
  test('formats a date to full weekday and month', () => {
    expect(formatDateForShortText(LocalDate.parse('2024-01-15'))).toEqual(
      'Monday, January 15th'
    )
  })
})

describe('dateToTitle', () => {
  test('returns today label when date is today', () => {
    const result = dateToTitle('2024-01-15')
    expect(result).toEqual('Today')
  })

  test('returns formatted date when date is not today', () => {
    const result = dateToTitle('2024-01-10')
    expect(result).toEqual('Wed 10. Jan 24')
  })
})

describe('humanizeDate', () => {
  test('returns empty string for undefined date', () => {
    expect(humanizeDate(undefined)).toEqual('')
  })

  test('returns empty string for invalid date', () => {
    expect(humanizeDate('not-a-date')).toEqual('')
  })

  test('returns today label when date is today', () => {
    expect(humanizeDate('2024-01-15')).toEqual('Today')
  })

  test('returns formatted date when date is not today', () => {
    expect(humanizeDate('2024-01-10')).toEqual('10. Jan 24')
  })
})
