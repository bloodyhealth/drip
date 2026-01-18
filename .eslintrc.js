module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-var': 'error',
    'prefer-const': 'error',
    'react/prop-types': 2,
    'no-extra-semi': 'off',
    'no-shadow': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
