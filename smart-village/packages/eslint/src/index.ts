import type { Linter } from 'eslint';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default function createTypeScriptConfig(): Linter.Config[] {
  return [
    {
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        parserOptions: {
          project: './tsconfig.json',
          tsconfigRootDir: import.meta.dirname,
        },
        plugins: {
          '@typescript-eslint': tsPlugin,
        },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/require-await': 'warn',
      },
    },
  ];
}
