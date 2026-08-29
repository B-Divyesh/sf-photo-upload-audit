import { defineConfig } from 'vite';
import packageJson from './package.json';
import { execFileSync } from 'node:child_process';

const buildId = (process.env.GITHUB_SHA || process.env.BUILD_ID || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' })).trim();

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(packageJson.version), __BUILD_ID__: JSON.stringify(buildId) },
  plugins: [{
    name: 'build-provenance',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'build.json',
        source: `${JSON.stringify({ product: packageJson.name, version: packageJson.version, build_id: buildId }, null, 2)}\n`,
      });
    },
  }],
  build: {
    outDir: 'dist/site',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: true,
  },
});
