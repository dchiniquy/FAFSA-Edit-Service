module.exports = {
  testEnvironment: 'node',
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/rules/**/*.js': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
