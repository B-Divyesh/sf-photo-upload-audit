import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';

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

test('@claim:same-folder-safe rejects a source and backup with the same selected root', async ({ page }) => {
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('same-root'));
  await page.locator('#destination-folder').setInputFiles(fixture('same-root'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByRole('alert')).toContainText('Choose two different folders');
  await expect(page.getByText('Every source file is accounted for')).toHaveCount(0);
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
