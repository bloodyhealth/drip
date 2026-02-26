import { render } from '@testing-library/react-native'
import AppIcon from '../../../components/common/app-icon'

jest.mock('react-native-vector-icons/Entypo', () => 'Icon')

describe('AppIcon component', () => {
  test('renders with required name prop', () => {
    const { toJSON } = render(<AppIcon name="home" />)
    expect(toJSON()).toBeTruthy()
  })

  test('renders with custom color', () => {
    const { toJSON } = render(<AppIcon name="home" color="red" />)
    expect(toJSON()).toBeTruthy()
  })
})
