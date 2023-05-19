module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  env: {
    jest: true
  },
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  extends: [
    'next',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'standard'
  ],
  rules: {
    camelcase: 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { destructuredArrayIgnorePattern: '^_' }],
    '@typescript-eslint/restrict-template-expressions': 'off',
    'arrow-body-style': 'warn',
    'implicit-arrow-linebreak': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-quotes': 'off',
    'max-len': 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
    'object-curly-spacing': ['error', 'always'],
    'react/function-component-definition': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-unused-modules': [2, {
      unusedExports: true,
      ignoreExports: [
        'hooks/useEffectDebugger.ts',
        'lib/backend/saveIssueDataToFile.ts',
        'lib/mergeStarMapsErrorGroups.ts',
        'lib/addStarMapsErrorsToStarMapsErrorGroups.ts',
        'pages/',
        'playwright.config.ts'
      ]
    }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in types are first
          ['external', 'unknown'],
          ['parent', 'sibling', 'internal', 'index']
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        warnOnUnassignedImports: true
      }
    ]
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.jsx', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'lib/', 'components/', 'hooks/', 'pages/']
      }
    }
  }
}
