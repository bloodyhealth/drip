import { render } from '@testing-library/react-native'
import Segment from '../../../components/common/segment'

describe('Segment component', () => {
  test('renders children', () => {
    const { toJSON } = render(<Segment>Content</Segment>)
    expect(toJSON()).toBeTruthy()
  })

  test('renders with title', () => {
    const { getByText } = render(<Segment title="My Title">Content</Segment>)
    expect(getByText('My Title')).toBeTruthy()
  })

  test('renders with subheader', () => {
    const { getByText } = render(
      <Segment subheader="My Subheader">Content</Segment>
    )
    expect(getByText('My Subheader')).toBeTruthy()
  })

  test('renders as last segment', () => {
    const { toJSON } = render(<Segment last>Content</Segment>)
    expect(toJSON()).toBeTruthy()
  })
})
