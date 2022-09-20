import React from 'react'
import { render, screen } from '@testing-library/react-native'

import License from '../../../components/settings/License'

describe('License screen', () => {
  test('It should have a correct year', async () => {
    render(<License />)
    const year = new Date().getFullYear().toString()

    screen.getByText(year, { exact: false })
  })

  test('It should match the snapshot', async () => {
    const licenseScreen = render(<License />)

    expect(licenseScreen).toMatchSnapshot()
  })
})
