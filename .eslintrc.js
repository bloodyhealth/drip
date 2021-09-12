module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  env: {
    node: true,
    mocha: true,
    es6: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: ['react'],
  settings: {
    react: {
      version: require('./package.json').dependencies.react,
    },
  },
  rules: {
    indent: ['error', 2],
    'no-console': ['error', {allow: ['warn', 'error']}],
    'space-before-function-paren': 0,
    semi: ['warn', 'never'],
    'space-infix-ops': ['warn'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-trailing-spaces': 'error',
    'react/prop-types': 2,
    'max-len': [
      1,
      {
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-multi-spaces': 2,
  },
}
