const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
})

module.exports = {
  ...createJestConfig,
  testEnvironment: 'jest-environment-node',
  preset: 'ts-jest',
  transform: {}
};
