import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  // Global ignores (replaces .eslintignore in modern ESLint)
  {
    ignores: ['test-results/', 'playwright-report/', 'blob-report/', 'node_modules/']
  },
  // Base TypeScript configuration
  ...tseslint.configs.recommended,
  
  // Playwright specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Custom overrides
      'playwright/no-focused-test': 'error', // Prevents committing test.only
      '@typescript-eslint/no-floating-promises': 'error', // Catches missing await in Playwright actions
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  }
);