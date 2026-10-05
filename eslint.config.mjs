import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    '.next-dev/**',
    'next-env.d.ts',
    'artifacts/**',
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
  ]),
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: { 'max-lines': ['error', { max: 350, skipBlankLines: true, skipComments: true }] },
  },
]);
