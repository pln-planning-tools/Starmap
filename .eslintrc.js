module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    jest: true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'next',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'destructuredArrayIgnorePattern': '^_' }],
    '@typescript-eslint/restrict-template-expressions': 'off',
    'arrow-body-style': 'off',
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
      "unusedExports": true,
      "ignoreExports": [
        'pages/',
        'components/roadmap/',
        'lib/backend/saveIssueDataToFile.ts',
        'lib/mergeStarMapsErrorGroups.ts',
        'lib/addStarMapsErrorsToStarMapsErrorGroups.ts',
        'playwright.config.ts',
      ]
    }]
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.jsx', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'lib/', 'components/', 'hooks/', 'pages/'],
      }
    }
  }
};
