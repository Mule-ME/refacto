import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'forks', // Fix process.chdir() issue
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/cli.ts', // CLI interface doesn't need coverage
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 100,
          lines: 98,
          statements: 98,
        },
      },
    },
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
