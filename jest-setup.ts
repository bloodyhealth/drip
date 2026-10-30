// Import Jest Native matchers
require('@testing-library/jest-native/extend-expect')
jest.mock('react-native-notify-kit', () =>
  require('react-native-notify-kit/jest-mock')
)
