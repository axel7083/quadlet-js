import { join } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

const PACKAGE_ROOT = __dirname;

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [svelte({ hot: !process.env.VITEST })],
  optimizeDeps: {
    exclude: [],
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    alias: [
      { find: '@testing-library/svelte', replacement: '@testing-library/svelte/svelte5' },
      {
        find: /^monaco-editor$/,
        replacement: `${PACKAGE_ROOT}/../../node_modules/monaco-editor/esm/vs/editor/editor.api`,
      },
    ],
    deps: {
      inline: [],
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    assetsDir: '.',

    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
