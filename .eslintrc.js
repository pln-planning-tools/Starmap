module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    // "next/core-web-vitals",
    // 'eslint:recommended',
    // 'airbnb',
    // 'airbnb-typescript',
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-multiple-empty-lines': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    'max-len': 'off',
    'arrow-body-style': 'warn',
    'react/function-component-definition': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'no-console': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'jsx-quotes': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'jsx-a11y/alt-text': 'off',
    'arrow-body-style': 'off',
  },
};
