import { LocalDate } from '@js-joda/core'

import {
  dateToShortMonth,
  dateToTitle,
  getMonthNames,
  getWeekdayNames,
  humanizeDate,
} from '../../components/helpers/format-date'
import i18n from '../../i18n/i18n'

describe('humanizeDate', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en-US')
  })

  test('if receives null, returns empty string', () => {
    const result = humanizeDate(null)

    expect(result).toEqual('')
  })

  test('if receives undefined, returns empty string', () => {
    const result = humanizeDate(undefined)

    expect(result).toEqual('')
  })

  test('if receives incorrectly formatted date, returns empty string', () => {
    const result = humanizeDate('abc')

    expect(result).toEqual('')
  })

  test('if receives correct date string, returns date in humanized format', () => {
    const result = humanizeDate('2022-01-07')

    expect(result).toEqual('Jan 07, 22')
  })

  test('if language is German, returns date in German format', async () => {
    await i18n.changeLanguage('de-DE')

    const result = humanizeDate('2022-01-07')

    expect(result).toEqual('07. Jan 22')
  })
})

describe('dateToTitle', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en-US')
  })

  test('if receives today, returns the translated today label', async () => {
    await i18n.changeLanguage('de-DE')

    const result = dateToTitle(LocalDate.now().toString())

    expect(result).toEqual('Heute')
  })

  test('if receives another date, returns the localized title', () => {
    const result = dateToTitle('2022-01-07')

    expect(result).toEqual('Fri, Jan 07, 22')
  })

  test('if language is German, returns title in German format', async () => {
    await i18n.changeLanguage('de-DE')

    const result = dateToTitle('2022-01-07')

    expect(result).toEqual('Fr., 07. Jan 22')
  })
})

describe('dateToShortMonth', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en-US')
  })

  test('returns the short month name', () => {
    const result = dateToShortMonth('2022-10-01')

    expect(result).toEqual('Oct')
  })

  test('if language is German, returns the short month name without dot', async () => {
    await i18n.changeLanguage('de-DE')

    const result = dateToShortMonth('2022-10-01')

    expect(result).toEqual('Okt')
  })
})

describe('getMonthNames', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en-US')
  })

  test('returns 12 long month names starting with January', () => {
    const result = getMonthNames('long')

    expect(result).toHaveLength(12)
    expect(result[0]).toEqual('January')
    expect(result[11]).toEqual('December')
  })

  test('if language is German, returns German month names', async () => {
    await i18n.changeLanguage('de-DE')

    const result = getMonthNames('long')

    expect(result[2]).toEqual('März')
    expect(result[9]).toEqual('Oktober')
  })
})

describe('getWeekdayNames', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en-US')
  })

  test('returns 7 weekday names starting with Sunday', () => {
    const result = getWeekdayNames('long')

    expect(result).toHaveLength(7)
    expect(result[0]).toEqual('Sunday')
    expect(result[6]).toEqual('Saturday')
  })

  test('if language is German, returns German weekday names', async () => {
    await i18n.changeLanguage('de-DE')

    const result = getWeekdayNames('long')

    expect(result[0]).toEqual('Sonntag')
    expect(result[1]).toEqual('Montag')
  })
})
