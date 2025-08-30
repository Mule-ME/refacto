import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'forks', // Fix process.chdir() issue
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/cli.ts' // CLI interface doesn't need coverage
      ],
      thresholds: {
        global: {
          branches: 70, // Lower thresholds for now
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'tests/integration/**']
  }
});