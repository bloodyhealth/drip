import React from 'react'
import { render } from '@testing-library/react-native'

import Stats from '../../components/stats'

jest.mock('../../components/common/AppHelp', () => 'AppHelp')
jest.mock('../../components/common/StatsOverview', () => 'StatsOverview')
jest.mock('../../components/common/StatsTable', () => 'StatsTable')

const mockGetAllCycleLengths = jest
  .fn()
  .mockImplementationOnce(() => [])
  .mockImplementationOnce(() => [30, 31, 30])
  .mockImplementationOnce(() => null)
  .mockImplementationOnce(() => undefined)

jest.mock('../../lib/cycle', () => ({
  __esModule: true,
  default: () => ({
    getAllCycleLengths: mockGetAllCycleLengths,
  }),
}))

describe('Stats screen', () => {
  test('when provided no data, renders no_data text', async () => {
    const { toJSON } = render(<Stats />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('when provided data, renders stats', async () => {
    const { toJSON } = render(<Stats />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('when provided null, renders no_data text', async () => {
    const { toJSON } = render(<Stats />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('when provided undefined, renders no_data text', async () => {
    const { toJSON } = render(<Stats />)

    expect(toJSON()).toMatchSnapshot()
  })
})
