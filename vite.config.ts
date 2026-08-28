import { defineConfig } from 'vite';
import packageJson from './package.json';

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(packageJson.version) },
  build: {
    outDir: 'dist/site',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: true,
  },
});
