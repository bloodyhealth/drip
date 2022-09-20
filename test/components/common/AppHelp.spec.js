import React from 'react'
import { render } from '@testing-library/react-native'

import AppHelp from '../../../components/common/AppHelp'

describe('AppHelp screen', () => {
  test('when provided text, should render it', async () => {
    const text = 'Some help test'
    const { toJSON } = render(<AppHelp text={text} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
