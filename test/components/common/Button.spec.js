import { render } from '@testing-library/react-native'
import Button from '../../../components/common/button'

jest.mock('../../../components/common/app-icon', () => 'AppIcon')

describe('Button component', () => {
  test('renders as CTA button', () => {
    const { toJSON } = render(<Button isCTA>Click me</Button>)
    expect(toJSON()).toBeTruthy()
  })

  test('renders as regular button', () => {
    const { toJSON } = render(<Button>Click me</Button>)
    expect(toJSON()).toBeTruthy()
  })

  test('renders with icon', () => {
    const { toJSON } = render(<Button iconName="home">Click me</Button>)
    expect(toJSON()).toBeTruthy()
  })

  test('renders with isSmall false', () => {
    const { toJSON } = render(<Button isSmall={false}>Click me</Button>)
    expect(toJSON()).toBeTruthy()
  })
})
