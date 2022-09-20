// Import Jest Native matchers
import '@testing-library/jest-native/extend-expect'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str, options) => str + (options ? JSON.stringify(options) : ''),
  }),
}))
