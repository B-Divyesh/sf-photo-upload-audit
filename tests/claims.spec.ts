import { test, expect } from '@playwright/test';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const fixture = (name: string) => path.resolve('tests/fixtures', name);

test('@claim:demo-sandbox opens a finished sample audit', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1, name: 'Find every gap in a photo backup' })).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('2 source files need attention')).toBeVisible();
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toBeVisible();
});

test('@claim:demo-reset restores the full sample receipt and All filter', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'missing 1' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('button', { name: 'All 8' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('tbody tr')).toHaveCount(8);
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toBeVisible();
});

test('@claim:demo-to-real discards the receipt before real folder selection', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:photo-upload-audit', 'cached-test-token');
    localStorage.setItem('sb_license_verdict:photo-upload-audit', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    localStorage.setItem('audit:receipts', '[]');
  });
  await page.goto('/?demo=1');
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/audit$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Compare two photo folders' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Compare every file' })).toBeDisabled();
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Save receipt' })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('audit:receipts'))).toBe('[]');
  await page.goBack();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/audit$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Compare two photo folders' })).toBeVisible();
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('audit:receipts'))).toBe('[]');
});

test('@claim:local-only sends no file data off origin', async ({ page }) => {
  const offOrigin: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') offOrigin.push(request.url());
  });
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('readonly-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('readonly-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect(offOrigin).toEqual([]);
});

test('@claim:hash-compare matches content when names differ', async ({ page }) => {
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('hash-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('hash-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByText('1 source files need attention')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'SHA-256 match' })).toBeVisible();
  await expect(page.getByRole('cell', { name: /Same name, different SHA-256/ })).toBeVisible();
});

test('@claim:live-photo identifies paired and unpaired sidecars', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Live Photo: complete').first()).toBeVisible();
  await page.getByRole('button', { name: 'missing 1' }).click();
  await expect(page.getByText('Live Photo: unpaired')).toBeVisible();
});

test('@claim:csv-export downloads one row per result', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(csv.split('\n')).toHaveLength(9);
  expect(csv).toContain('status,source_path,destination_paths,bytes,sha256,live_pair,note');
  expect(csv).toContain('missing,iPhone Export/2026/IMG_1844.MOV');
});

test('@claim:no-account core audit is available without a license', async ({ page }) => {
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('readonly-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('readonly-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByText('Every source file is accounted for')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await expect(await downloadPromise).toBeTruthy();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:photo-upload-audit'))).toBeNull();
});

test('@claim:read-only scan leaves selected file inputs intact', async ({ page }) => {
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('readonly-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('readonly-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByText('Every source file is accounted for')).toBeVisible();
  await expect(page.getByText('original.jpg', { exact: true })).toBeVisible();
});

test('@claim:offline-reload demo works after the connection drops', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL || '')).toContain('/sw.js');
  await expect.poll(() => page.evaluate(async () => {
    const keys = await caches.keys();
    const cached = await Promise.all(keys.map((key) => caches.open(key).then((cache) => cache.keys())));
    return cached.flat().map((request) => new URL(request.url).pathname).filter((path) => path.startsWith('/assets/'));
  })).toEqual(expect.arrayContaining([expect.stringMatching(/\.js$/), expect.stringMatching(/\.css$/)]));
  await page.waitForTimeout(250);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Find every gap in a photo backup' })).toBeVisible();
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toBeVisible();
});

test('@claim:license-private verification sends only the license token', async ({ page }) => {
  let requestUrl = '';
  let requestBody: string | null = 'unexpected';
  await page.addInitScript(() => localStorage.setItem('sb_license:photo-upload-audit', 'test-token-123'));
  await page.route('https://api.sociobot.in/**', async (route) => {
    requestUrl = route.request().url();
    requestBody = route.request().postData();
    await route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } });
  });
  await page.goto('/');
  await expect.poll(() => requestUrl).toContain('/products/photo-upload-audit/verify?license=test-token-123');
  expect(requestBody).toBeNull();
});

test('@claim:archive-license saves receipts and prints certificates', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:photo-upload-audit', 'cached-test-token');
    localStorage.setItem('sb_license_verdict:photo-upload-audit', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto('/');
  await expect(page.getByText('$19', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy Archive License' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/photo-upload-audit/checkout');
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('readonly-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('readonly-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await page.getByRole('button', { name: 'Save receipt' }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('audit:receipts') || '[]').length)).toBe(1);
  await page.getByRole('link', { name: 'History', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Review saved audit receipts' })).toBeVisible();
  await page.getByRole('button', { name: 'Open receipt' }).click();
  await expect(page.getByText('Every source file is accounted for')).toBeVisible();
  await page.evaluate(() => { window.print = () => localStorage.setItem('test:printed', 'yes'); });
  await page.getByRole('button', { name: 'Print certificate' }).click();
  expect(await page.evaluate(() => localStorage.getItem('test:printed'))).toBe('yes');
});

test('@claim:receipt-removal removes only the selected saved receipt after reload', async ({ page }) => {
  await page.goto('/history');
  await page.evaluate(() => localStorage.setItem('audit:receipts', JSON.stringify([
    { id: 'first', sourceLabel: 'First export', destinationLabel: 'First backup', createdAt: '2026-08-01T00:00:00.000Z', sourceCount: 1, destinationCount: 1, rows: [], durationMs: 1 },
    { id: 'second', sourceLabel: 'Second export', destinationLabel: 'Second backup', createdAt: '2026-08-02T00:00:00.000Z', sourceCount: 1, destinationCount: 1, rows: [], durationMs: 1 },
  ])));
  await page.reload();
  await page.getByRole('button', { name: 'Remove' }).first().click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('audit:receipts') || '[]').map((receipt: { id: string }) => receipt.id))).toEqual(['second']);
  await page.reload();
  await expect(page.getByText('First export')).toHaveCount(0);
  await expect(page.getByText('Second export')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('audit:receipts') || '[]').map((receipt: { id: string }) => receipt.id))).toEqual(['second']);
});

test('@claim:classifications reports missing changed duplicate and extra files', async ({ page }) => {
  await page.goto('/demo');
  for (const label of ['missing 1', 'changed 1', 'duplicate 1', 'extra 1']) {
    await page.getByRole('button', { name: label }).click();
    await expect(page.locator('tbody tr')).toHaveCount(1);
  }
});

test('@claim:no-analytics makes no analytics or advertising requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  expect(external).toEqual([]);
});

test('@claim:desktop-downloads shows a usable detected-platform installer link', async ({ page }) => {
  await page.route('https://api.github.com/repos/B-Divyesh/sf-photo-upload-audit/releases/latest', (route) => route.fulfill({ json: {
    tag_name: 'v0.1.1', html_url: 'https://github.com/B-Divyesh/sf-photo-upload-audit/releases/tag/v0.1.1',
    assets: [
      { name: 'photo-upload-audit_0.1.1_amd64.AppImage', browser_download_url: 'https://github.com/B-Divyesh/sf-photo-upload-audit/releases/download/v0.1.1/photo-upload-audit_0.1.1_amd64.AppImage' },
      { name: 'photo-upload-audit_0.1.1_x64.dmg', browser_download_url: 'https://github.com/B-Divyesh/sf-photo-upload-audit/releases/download/v0.1.1/photo-upload-audit_0.1.1_x64.dmg' },
      { name: 'photo-upload-audit_0.1.1_aarch64.dmg', browser_download_url: 'https://github.com/B-Divyesh/sf-photo-upload-audit/releases/download/v0.1.1/photo-upload-audit_0.1.1_aarch64.dmg' },
      { name: 'photo-upload-audit_0.1.1_x64.msi', browser_download_url: 'https://github.com/B-Divyesh/sf-photo-upload-audit/releases/download/v0.1.1/photo-upload-audit_0.1.1_x64.msi' },
    ],
  } }));
  await page.goto('/?release-preview=1');
  await expect(page.locator('[data-downloads]').getByRole('link', { name: /Download for/ }).first()).toHaveAttribute('href', /releases\/download\/v0\.1\.1\//);
});

test('@claim:release-integrity-files verifies a published release checksum', async ({ request }) => {
  const response = await request.get('https://api.github.com/repos/B-Divyesh/sf-photo-upload-audit/releases/latest');
  expect(response.ok()).toBe(true);
  const release = await response.json() as { assets: Array<{ name: string; browser_download_url: string }> };
  const sums = release.assets.find((asset) => asset.name === 'SHA256SUMS');
  const manifest = release.assets.find((asset) => asset.name === 'latest.json');
  expect(sums).toBeTruthy();
  expect(manifest).toBeTruthy();
  const sumText = await (await request.get(sums!.browser_download_url)).text();
  const asset = release.assets.find((item) => /\.deb$/i.test(item.name))!;
  expect(asset).toBeTruthy();
  const bytes = await (await request.get(asset.browser_download_url)).body();
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(sumText.match(new RegExp(`^([a-f0-9]{64})\\s+\\*?${asset.name.replaceAll('.', '\\.')}$`, 'm'))?.[1]);
});

test('@claim:unsigned-installers names the exact unsigned release version', async ({ page }) => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as { version: string };
  await page.goto('/');
  await expect(page.getByText(`Desktop installers for v${packageJson.version} are unsigned.`)).toBeVisible();
});

test('@claim:receipt-limit keeps at most 25 local receipts and explains the limit', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:photo-upload-audit', 'cached-test-token');
    localStorage.setItem('sb_license_verdict:photo-upload-audit', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    localStorage.setItem('audit:receipts', JSON.stringify(Array.from({ length: 25 }, (_, index) => ({ id: String(index) }))));
  });
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('readonly-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('readonly-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await page.getByRole('button', { name: 'Save receipt' }).click();
  await expect(page.getByText('Your 25 saved receipt limit is full. Remove a saved receipt before adding another.')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('audit:receipts') || '[]').length)).toBe(25);
});

test('@claim:checkout-health sends buyers to a live hosted checkout', async ({ request }) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/photo-upload-audit/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\//);
});
