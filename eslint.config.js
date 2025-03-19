const js = require('@eslint/js');
const globals = require('globals');
const typescriptParser = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.Config} */
module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        module: 'writable',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'react': require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      // Disable duplicated rules
      'no-unused-vars': 'off', // We use @typescript-eslint/no-unused-vars instead
      
      // TypeScript rules - relaxed for now
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      
      // React rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off', // Not needed in modern React with JSX transform
      'react/prop-types': 'off', // We use TypeScript for prop validation
      
      // React Hooks rules - relaxed for now
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // General rules
      'no-console': 'off', // Allow console for now
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      'curly': ['error', 'all'],
    },
  },
  {
    // Special configuration for test files
    files: ['**/__tests__/**/*.{ts,tsx,js,jsx}', '**/*.test.{ts,tsx,js,jsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    // Configuration for configuration files
    files: ['*.config.js', '.*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    // Ignore specific files and directories
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '**/*.d.ts',
      'jest.setup.js',
      '__tests__/jest.setup.js',
      '__tests__/jest.ci.setup.js',
      'babel.config.js',
      'metro.config.js',
    ],
  },
]; 