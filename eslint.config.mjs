import js from '@eslint/js'
import globals from 'globals'

const OFF = 0,
  WARN = 1,
  ERROR = 2

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node
    },
    rules: {
      'semi': [ERROR, 'never'],
      'no-debugger': process.env.NODE_ENV === 'development' ? OFF : ERROR,
    },
  },
]
