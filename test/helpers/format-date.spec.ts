import { LocalDate } from '@js-joda/core'

import { dateToTitle, humanizeDate } from '../../components/helpers/format-date'
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

    expect(result).toEqual('07. Jan. 22')
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

    expect(result).toEqual('Fr., 07. Jan. 22')
  })
})
