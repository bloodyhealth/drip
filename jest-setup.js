// Import Jest Native matchers
require('@testing-library/jest-native/extend-expect')
const mock = require('@notifee/react-native/jest-mock')

jest.mock('@notifee/react-native', () => mock)
