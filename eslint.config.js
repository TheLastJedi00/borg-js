import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['dist/', 'docs-dist/', 'node_modules/', 'coverage/', 'extensao-vscode/dist/', 'dist-extensao/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },
  {
    files: ['*.config.js', 'build/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
]
