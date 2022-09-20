import React from 'react'
import { render } from '@testing-library/react-native'

import StatsTable from '../../../components/common/StatsTable'

const mockGetStats = jest
  .fn()
  .mockImplementationOnce(() => [
    { date: '2022-07-01', cycleLength: 31, bleedingLength: 5 },
    { date: '2022-06-01', cycleLength: 31, bleedingLength: 5 },
  ])
  .mockImplementationOnce(() => [])
  .mockImplementationOnce(() => null)
  .mockImplementationOnce(() => undefined)

jest.mock('../../../lib/cycle', () => ({
  __esModule: true,
  default: () => ({
    getStats: mockGetStats,
  }),
}))

describe('StatsTable screen', () => {
  test('when provided correct data set, renders it', async () => {
    const { toJSON } = render(<StatsTable onClose={jest.fn()} />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('when provided no data, renders nothing', async () => {
    const { toJSON } = render(<StatsTable onClose={jest.fn()} />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('when provided null, renders nothing', async () => {
    const { toJSON } = render(<StatsTable onClose={jest.fn()} />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('when provided undefined, renders nothing', async () => {
    const { toJSON } = render(<StatsTable onClose={jest.fn()} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
