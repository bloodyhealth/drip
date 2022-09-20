import React from 'react'
import { render } from '@testing-library/react-native'

import StatsOverview from '../../../components/common/StatsOverview'

describe('StatsOverview screen', () => {
  test('when provided correct, renders it', async () => {
    const data = [
      [21, 'shortest'],
      [21, 'longest'],
      [0, 'standard deviation'],
      [2, 'completed cycles'],
    ]
    const { toJSON } = render(<StatsOverview data={data} />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('when provided empty data, renders nothing (does not break)', async () => {
    const data = []
    const { toJSON } = render(<StatsOverview data={data} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
