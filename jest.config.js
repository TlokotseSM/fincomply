module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.interface.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/core/(.*)$': '<rootDir>/core/$1',
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
    '^@/employees/(.*)$': '<rootDir>/employees/$1',
    '^@/companies/(.*)$': '<rootDir>/companies/$1',
    '^@/compliance/(.*)$': '<rootDir>/compliance/$1',
    '^@/integrations/(.*)$': '<rootDir>/integrations/$1',
  },
};