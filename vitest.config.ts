import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['tests/unit.setup.ts'],
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      transformMode: {
        web: [/\.[jt]sx$/]
      },
      coverage: {
        provider: 'v8',
        // count every source file, not only the ones a test imports
        all: true,
        include: ['src/**/*.{ts,vue}'],
        exclude: [
          'src/**/__tests__/**',
          'src/types/**',
          // static content, never edited
          'src/stores/microlearning/data.ts'
        ],
        reporter: ['text-summary', 'html'],
        // floor a little under the current coverage, raise it as tests are added
        statements: 73,
        branches: 67,
        functions: 30,
        lines: 73
      }
    }
  })
);
