import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import typescriptEslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist/', 'node_modules/', '.git/']
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx,vue}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    rules: {}
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...typescriptEslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
]
