import { render, fireEvent } from '@testing-library/react-native'
import { Linking } from 'react-native'
import AppLink from '../../../components/common/AppLink'

describe('AppLink component', () => {
  test('renders children correctly', () => {
    const { getByText } = render(
      <AppLink url="https://example.com">Click me</AppLink>
    )
    expect(getByText('Click me')).toBeTruthy()
  })

  test('opens URL when pressed', () => {
    const url = 'https://example.com'
    jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve())
    const { getByText } = render(<AppLink url={url}>Click me</AppLink>)
    fireEvent.press(getByText('Click me'))
    expect(Linking.openURL).toHaveBeenCalledWith(url)
  })
})
