import {
  determinePredictionText,
  formatWithOrdinalSuffix,
} from '../../components/helpers/home'
import { LocalDate } from '@js-joda/core'
import '../../i18n/i18n'

const t = (key, params) => {
  if (params) return `${key} ${JSON.stringify(params)}`
  return key
}

describe('determinePredictionText', () => {
  test('returns noPrediction when bleedingPrediction is empty', () => {
    expect(determinePredictionText([], t)).toEqual(
      'labels.bleedingPrediction.noPrediction'
    )
  })

  test('returns future text when today is before predicted bleeding start', () => {
    jest.spyOn(LocalDate, 'now').mockReturnValue(LocalDate.parse('2024-01-01'))
    const prediction = [['2024-01-10', '2024-01-11', '2024-01-12']]
    const result = determinePredictionText(prediction, t)
    expect(result).toContain('cycleDay.bleedingPrediction.future')
  })

  test('returns past text when today is after predicted bleeding end', () => {
    jest.spyOn(LocalDate, 'now').mockReturnValue(LocalDate.parse('2024-02-01'))
    const prediction = [['2024-01-10', '2024-01-11', '2024-01-12']]
    const result = determinePredictionText(prediction, t)
    expect(result).toContain('cycleDay.bleedingPrediction.past')
  })

  test('returns current day text when today is during predicted bleeding', () => {
    jest.spyOn(LocalDate, 'now').mockReturnValue(LocalDate.parse('2024-01-11'))
    const prediction = [['2024-01-10', '2024-01-11', '2024-01-12']]
    const result = determinePredictionText(prediction, t)
    expect(result).toContain('cycleDay.bleedingPrediction.day')
  })
})

describe('formatWithOrdinalSuffix', () => {
  test('formats 1 as 1st', () => {
    expect(formatWithOrdinalSuffix(1)).toEqual('1st')
  })
  test('formats 2 as 2nd', () => {
    expect(formatWithOrdinalSuffix(2)).toEqual('2nd')
  })
  test('formats 3 as 3rd', () => {
    expect(formatWithOrdinalSuffix(3)).toEqual('3rd')
  })
  test('formats 4 as 4th', () => {
    expect(formatWithOrdinalSuffix(4)).toEqual('4th')
  })
  test('formats 11 as 11th', () => {
    expect(formatWithOrdinalSuffix(11)).toEqual('11th')
  })
})
