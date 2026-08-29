import { defineConfig } from 'vite';
import packageJson from './package.json';
import { execFileSync } from 'node:child_process';

function releaseBuildId(): string {
  const supplied = process.env.GITHUB_SHA || process.env.BUILD_ID;
  if (supplied) return supplied.trim();
  try {
    // Keep a documentation-only commit after a release from making the site
    // hide the installer that has the same published application version.
    return execFileSync('git', ['rev-list', '-n', '1', `v${packageJson.version}`], { encoding: 'utf8' }).trim();
  } catch {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  }
}

const buildId = releaseBuildId();

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
