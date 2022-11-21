const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
})

module.exports = {
  ...createJestConfig,
  testEnvironment: 'jest-environment-node',
  preset: 'ts-jest',
  transform: {},
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
};
