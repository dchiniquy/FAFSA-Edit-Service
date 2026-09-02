module.exports = {
  testEnvironment: 'node',
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    // Actual coverage across the whole codebase is 100% (verified by `npm run
    // test:coverage`). These floors are intentionally set at that already-achieved
    // level, not padded below it: a threshold looser than what's actually covered
    // would let a future change silently drop tests for a whole branch/function
    // without ever turning CI red. src/rules/** (the 7 business rules + the
    // engine/helpers they depend on) is the test-first-built business core this
    // service exists for, so it is held to 100%, not just "global minus a few
    // percent". Raise/lower these only alongside a deliberate, reviewed change in
    // what's actually being tested - not to paper over a coverage regression.
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './src/rules/**/*.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
