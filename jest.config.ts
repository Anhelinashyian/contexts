export { };
module.exports = {
  preset: "ts-jest",
  collectCoverage: true,
  collectCoverageFrom: ['client/src/**/*.{ts,tsx}', '!src/**/*.d.ts',
    '!**/vendor/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'text'],
  testEnvironment: 'jsdom',
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    "reportWebVitals.ts",
    "setupTests.ts",
    "index.tsx"
  ],
}