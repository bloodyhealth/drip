module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?|@notifee)/)',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
