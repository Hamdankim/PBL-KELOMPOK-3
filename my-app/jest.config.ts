import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  // Gunakan jsdom untuk simulate browser environment
  testEnvironment: 'jest-environment-jsdom',
  
  // File setup yang dijalankan sebelum semua test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Mapping path alias (seperti @ ke src/)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock CSS dan SCSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Pattern untuk cari file test
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
  
  // Exclude files dari coverage report
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  
  // Coverage threshold (minimum requirement)
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50,
    },
  },
}

export default createJestConfig(config)
