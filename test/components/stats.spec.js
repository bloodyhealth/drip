import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

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
  .mockImplementationOnce(() => [30, 31, 30])

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

  test('when button is clicked, StatsTable is rendered', async () => {
    const { getByText, findByTestId } = render(<Stats />)
    const button = getByText('show_stats')

    fireEvent(button, 'click')

    await expect(findByTestId('statsTable')).toBeTruthy()
  })
})
