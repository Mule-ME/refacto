import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['cjs', 'esm'],
  target: 'es2020',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  minify: false,
  external: [],
  shims: true, // Add shims for import.meta in CJS
  // Generate both .js and .mjs files
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs',
    };
  },
});