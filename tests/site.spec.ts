import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

const fixture = (name: string) => path.resolve('tests/fixtures', name);

for (const route of ['/', '/demo', '/audit', '/privacy', '/terms', '/does-not-exist']) {
  test(`route ${route} has one h1 and no serious accessibility violations`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Photo Upload Audit/);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('mobile demo fits a 390px viewport and remains operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'missing 1' }).click();
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('history navigation restores routes and heading focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('h1')).toBeFocused();
});

test('@claim:same-folder-safe rejects the same directory handle and accepts different same-named handles', async ({ page }) => {
  await page.addInitScript(() => {
    const file = (name: string, body: string) => new File([body], name, { type: 'image/jpeg', lastModified: 1 });
    const one = { name: 'DCIM', kind: 'directory', isSameEntry: async (other: unknown) => other === one, entries: async function* () { yield ['one.jpg', { kind: 'file', getFile: async () => file('one.jpg', 'one') }]; } };
    const two = { name: 'DCIM', kind: 'directory', isSameEntry: async (other: unknown) => other === two, entries: async function* () { yield ['two.jpg', { kind: 'file', getFile: async () => file('two.jpg', 'two') }]; } };
    let calls = 0;
    Object.defineProperty(window, 'showDirectoryPicker', { configurable: true, value: async () => (++calls <= 2 ? one : two) });
  });
  await page.goto('/audit');
  await page.getByRole('button', { name: 'Choose export folder' }).click();
  await page.getByRole('button', { name: 'Choose backup folder' }).click();
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByRole('alert')).toContainText('Choose two different folders');
  await expect(page.getByText('Every source file is accounted for')).toHaveCount(0);
  await page.getByRole('button', { name: 'Choose backup folder' }).click();
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByText('1 source files need attention')).toBeVisible();
});

test('@claim:scan-progress keeps the current file and count visible during hashing', async ({ page }) => {
  await page.addInitScript(() => {
    const original = File.prototype.stream;
    File.prototype.stream = function () {
      const stream = original.call(this);
      const reader = stream.getReader();
      return new ReadableStream({ async pull(controller) { await new Promise((resolve) => setTimeout(resolve, 60)); const next = await reader.read(); if (next.done) controller.close(); else controller.enqueue(next.value); } });
    };
  });
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('hash-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('hash-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  const progress = page.locator('.scan-progress');
  await expect(progress).toBeVisible();
  await expect(progress).toContainText(/1 \/ 2/);
  await expect(progress.locator('p')).not.toHaveText('Building the receipt…');
});

test('@claim:source-first keeps source before backup on desktop and mobile', async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/audit');
    const order = await page.locator('.folder-picker').evaluateAll((pickers) => pickers.map((picker) => picker.textContent));
    expect(order[0]).toContain('Camera export');
    expect(order[1]).toContain('Backup folder');
  }
});

test('pre-rendered routes publish route-specific metadata and a real 404 configuration', async () => {
  const expectations: Record<string, string> = { 'demo.html': 'Demo — Photo Upload Audit', 'audit.html': 'Audit folders — Photo Upload Audit', 'privacy.html': 'Privacy — Photo Upload Audit', 'terms.html': 'Terms — Photo Upload Audit', '404.html': 'Page not found — Photo Upload Audit' };
  for (const [file, title] of Object.entries(expectations)) {
    const html = await readFile(`dist/site/${file}`, 'utf8');
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toContain(`property="og:title" content="${title}"`);
    expect(html).toContain(`name="twitter:title" content="${title}"`);
  }
  const config = JSON.parse(await readFile('dist/site/staticwebapp.config.json', 'utf8')) as { responseOverrides: { '404': { rewrite: string; statusCode: number } } };
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
});

test('@claim:one-to-one-match allocates one backup file to at most one identical source file', async ({ page }) => {
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('duplicate-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('duplicate-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByText('1 source files need attention')).toBeVisible();
  await page.getByRole('button', { name: 'missing 1' }).click();
  await expect(page.getByRole('cell', { name: 'No matching backup file' })).toBeVisible();
  await page.getByRole('button', { name: 'verified 1' }).click();
  await expect(page.getByRole('cell', { name: 'only-copy.jpg' })).toBeVisible();
});

test('demo startup never reads or verifies a real license', async ({ page }) => {
  let licenseRequest = false;
  await page.addInitScript(() => localStorage.setItem('sb_license:photo-upload-audit', 'real-user-token'));
  await page.route('https://api.sociobot.in/**', (route) => { licenseRequest = true; return route.abort(); });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Find every gap in a photo backup' })).toBeVisible();
  expect(licenseRequest).toBe(false);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:photo-upload-audit'))).toBe('real-user-token');
  expect(await page.evaluate(() => localStorage.getItem('sb_license_verdict:photo-upload-audit'))).toBeNull();
});

test('folder pickers have visible keyboard focus and a full-size control', async ({ page }) => {
  await page.goto('/audit');
  const picker = page.locator('#source-folder');
  await picker.focus();
  await expect(picker).toBeFocused();
  const geometry = await picker.evaluate((input) => {
    const box = input.getBoundingClientRect();
    const style = getComputedStyle(input);
    return { width: box.width, height: box.height, opacity: style.opacity, outline: style.outlineStyle };
  });
  expect(geometry.width).toBeGreaterThanOrEqual(44);
  expect(geometry.height).toBeGreaterThanOrEqual(44);
  expect(geometry.opacity).toBe('1');
  expect(geometry.outline).toBe('solid');
});

test('390px at 200% text size has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.goto('/audit');
  await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('privacy explains that uninstalling can retain local desktop data', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByText('Uninstalling may leave local app data behind.')).toBeVisible();
  await expect(page.getByText("Check your operating system's app-data location before sharing the computer.")).toBeVisible();
  await expect(page.getByText('Removing the desktop app removes its local data.')).toHaveCount(0);
});

test('landing uses a plain-language progress heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Follow the file check', { exact: true })).toBeVisible();
  await expect(page.getByText('Watch each hash', { exact: true })).toHaveCount(0);
});
