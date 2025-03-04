import dts from 'vite-plugin-dts';
import type { UserConfig } from "vite";
import { join } from 'node:path';

const PACKAGE_ROOT = __dirname;

const config: UserConfig = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  /**
   * A Vite plugin that generates declaration files
   */
  plugins: [dts({
    tsconfigPath: join(PACKAGE_ROOT, 'tsconfig.min.json'),
  })],
  build: {
    sourcemap: 'inline',
    target: 'esnext',
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE === 'production' ? 'esbuild' : false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
};

export default config;
