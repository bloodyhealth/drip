import cycleModule from '../lib/cycle'
import { LocalDate } from '@js-joda/core'

describe('getStats', () => {
  test('returns cycle length and bleeding length for each cycle start', () => {
    const cycleDaysSortedByDate = [
      { date: '2018-08-01', bleeding: { value: 2 } },
      { date: '2018-07-18', bleeding: { value: 2 } },
      { date: '2018-07-05', bleeding: { value: 2 } },
    ]

    jest.spyOn(LocalDate, 'now').mockReturnValue(LocalDate.parse('2018-08-10'))

    const { getStats } = cycleModule({
      cycleDaysSortedByDate,
      cycleStartsSortedByDate: cycleDaysSortedByDate,
      bleedingDaysSortedByDate: cycleDaysSortedByDate,
    })

    const result = getStats()

    expect(result).toHaveLength(3)
    expect(result[0].date).toEqual('2018-08-01')
    expect(result[1].date).toEqual('2018-07-18')
    expect(result[1].cycleLength).toEqual(14)
    expect(result[2].date).toEqual('2018-07-05')
    expect(result[2].cycleLength).toEqual(13)
  })
})
