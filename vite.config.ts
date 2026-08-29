import { defineConfig } from 'vite';
import packageJson from './package.json';
import { execFileSync } from 'node:child_process';

function gitOutput(args: string[]): string | undefined {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return undefined;
  }
}

function releaseBuildId(): string {
  const supplied = process.env.GITHUB_SHA || process.env.BUILD_ID;
  if (supplied) return supplied.trim();
  const tag = `v${packageJson.version}`;
  const localTag = gitOutput(['rev-list', '-n', '1', tag]);
  if (localTag) return localTag;
  // A fresh shallow clone has no tags. Resolve an annotated tag's peeled commit
  // from its configured remote before falling back to the checkout commit.
  const remoteLines = gitOutput(['ls-remote', 'origin', `refs/tags/${tag}`, `refs/tags/${tag}^{}`])?.split(/\r?\n/) ?? [];
  const peeled = remoteLines.find((line) => line.endsWith(`refs/tags/${tag}^{}`));
  const direct = remoteLines.find((line) => line.endsWith(`refs/tags/${tag}`));
  const remoteCommit = (peeled || direct)?.split(/\s+/)[0];
  return remoteCommit || gitOutput(['rev-parse', 'HEAD']) || 'unknown';
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
