const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-node',
  collectCoverage: true,
  collectCoverageFrom: ['lib', 'components', 'hooks', 'pages'].map(dir => `${dir}/**/*.{js,jsx,ts,tsx}`),
  preset: 'ts-jest',
  transform: {
    // this is required because: https://github.com/vercel/next.js/discussions/19155
    // next overwrites the default jest transform for ts/tsx files
    // this is a workaround to use ts-jest for tests
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
};

module.exports = createJestConfig(customJestConfig)
