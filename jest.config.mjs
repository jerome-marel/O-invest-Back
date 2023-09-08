const config = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  collectCoverage: true,
  coverageProvider: 'v8',
  verbose: true,
  testEnvironment: 'jest-environment-node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'mjs'],

};

export default config;
