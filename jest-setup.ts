// Import Jest Native matchers
require('@testing-library/jest-native/extend-expect')
jest.mock('@notifee/react-native', () =>
  require('@notifee/react-native/jest-mock')
)
