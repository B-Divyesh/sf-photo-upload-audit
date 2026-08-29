import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const origin = (process.argv[2] || 'https://photo-upload-audit.sociobot.in').replace(/\/$/, '');
const evidenceDir = path.resolve(process.argv[3] || '.factory/evidence/polish-8-live');
await mkdir(evidenceDir, { recursive: true });

const expected = [
  ['/', 'Photo Upload Audit — Check photo backups', 'home'],
  ['/?demo=1', 'Demo — Photo Upload Audit', 'demo-query'],
  ['/demo', 'Demo — Photo Upload Audit', 'demo'],
  ['/audit', 'Audit folders — Photo Upload Audit', 'audit'],
  ['/history', 'Saved receipts — Photo Upload Audit', 'history'],
  ['/privacy', 'Privacy — Photo Upload Audit', 'privacy'],
  ['/terms', 'Terms — Photo Upload Audit', 'terms'],
];

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const browser = await chromium.launch();
const report = { origin, checkedAt: new Date().toISOString(), routes: [], demo: {}, offline: {}, focus: {}, release: {}, notFound: {} };

for (const [route, expectedTitle, screenshotName] of expected) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(500);
  const axe = await new AxeBuilder({ page }).analyze();
  const seriousAxe = axe.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  const details = await page.evaluate(() => {
    const targets = [...document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"]')].flatMap((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || box.width === 0 || box.height === 0 || box.width >= 44 && box.height >= 44) return [];
      return [{ name: (element.getAttribute('aria-label') || element.textContent || element.id || element.tagName).trim(), width: box.width, height: box.height }];
    });
    return {
      title: document.title,
      lang: document.documentElement.lang,
      h1: [...document.querySelectorAll('h1')].map((heading) => heading.textContent?.trim()),
      mainCount: document.querySelectorAll('main').length,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
      targets,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      privacyHref: document.querySelector('footer a[href="/privacy"]')?.getAttribute('href'),
      termsHref: document.querySelector('footer a[href="/terms"]')?.getAttribute('href'),
    };
  });
  assert(response?.status() === 200, `${route} returned ${response?.status()}`);
  assert(details.title === expectedTitle, `${route} title was ${details.title}`);
  assert(details.lang === 'en' && details.h1.length === 1 && details.mainCount === 1, `${route} landmark check failed`);
  assert(details.privacyHref === '/privacy' && details.termsHref === '/terms', `${route} legal links failed`);
  assert(!details.overflow && details.targets.length === 0, `${route} mobile geometry failed`);
  assert(seriousAxe.length === 0 && errors.length === 0, `${route} accessibility or console check failed`);
  await page.screenshot({ path: path.join(evidenceDir, `${screenshotName}-390.png`), fullPage: true });
  report.routes.push({ route, status: response.status(), ...details, seriousAxe: seriousAxe.map(({ id }) => id), errors });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.addInitScript(() => {
    const writes = [];
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      writes.push({ area: this === localStorage ? 'local' : 'session', key, url: location.href });
      return original.call(this, key, value);
    };
    window.__demoWrites = writes;
  });
  await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle', timeout: 60_000 });
  assert(await page.getByText('Demo — sample data, nothing is saved').isVisible(), 'Demo banner missing');
  assert(await page.locator('tbody tr').count() === 8, 'Demo did not start with eight rows');
  await page.getByRole('button', { name: 'missing 1' }).click();
  assert(await page.locator('tbody tr').count() === 1, 'Missing filter did not show one row');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert(await page.locator('tbody tr').count() === 8, 'Reset did not restore eight rows');
  await page.screenshot({ path: path.join(evidenceDir, 'demo-reset-390.png'), fullPage: true });
  const storage = await page.evaluate(() => ({ writes: window.__demoWrites, local: localStorage.length, session: sessionStorage.length }));
  assert(storage.writes.length === 0 && storage.local === 0 && storage.session === 0, 'Demo wrote browser storage');
  assert(requests.every((url) => new URL(url).origin === origin), 'Demo made an off-origin request');
  await page.getByRole('link', { name: 'Start for real' }).click();
  assert(new URL(page.url()).pathname === '/audit', 'Start for real did not open /audit');
  assert(await page.getByText('IMG_1844.MOV', { exact: true }).count() === 0, 'Sample row remained after demo');
  assert(await page.getByRole('button', { name: 'Compare every file' }).isDisabled(), 'Real audit did not start empty');
  await page.screenshot({ path: path.join(evidenceDir, 'demo-to-real-390.png'), fullPage: true });
  report.demo = { initialRows: 8, missingRows: 1, resetRows: 8, storage, requests, finalUrl: page.url(), sampleRowsAfterExit: 0 };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const rows = await page.locator('tbody tr').count();
  assert(rows === 8, 'Offline demo did not restore eight rows');
  report.offline = { rows, title: await page.title() };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${origin}/`, { waitUntil: 'networkidle', timeout: 60_000 });
  const text = await page.locator('body').textContent();
  assert(text.includes('Folder comparison walkthrough') && text.includes('Privacy and backup limits'), 'New section labels are missing');
  assert(!text.includes('Inside the app') && !text.includes('Clear boundaries'), 'Old section labels remain');
  const releaseText = await page.locator('[data-downloads]').innerText();
  const footer = await page.locator('.build').innerText();
  assert(releaseText.includes('v0.1.5') && footer.includes('v0.1.5') && footer.includes('1c7b93b45924'), 'Release identity is stale');
  const firstScreen = await page.locator('h1, .lede, .hero-action, .plain-facts').evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect();
    return { text: element.textContent?.trim(), top: box.top, bottom: box.bottom };
  }));
  assert(firstScreen.every(({ top, bottom }) => top >= 0 && bottom <= 844), 'First-screen content falls below the phone viewport');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await page.goBack();
  const focused = await page.evaluate(() => document.activeElement?.tagName === 'H1');
  assert(focused, 'Back navigation did not focus the h1');
  report.focus = { backFocusedH1: focused, firstScreen };
  report.release = { releaseText, footer, labels: ['Folder comparison walkthrough', 'Privacy and backup limits'] };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const response = await page.goto(`${origin}/does-not-exist-polish-8`, { waitUntil: 'networkidle', timeout: 60_000 });
  const heading = await page.locator('h1').innerText();
  assert(response?.status() === 404 && heading === 'This page is missing from the archive', 'Live 404 failed');
  await page.screenshot({ path: path.join(evidenceDir, 'not-found-390.png'), fullPage: true });
  report.notFound = { status: response.status(), heading };
  await context.close();
}

await browser.close();
await writeFile(path.join(evidenceDir, 'live-recheck.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ routes: report.routes.length, demo: report.demo, offline: report.offline, focus: report.focus, release: report.release, notFound: report.notFound }, null, 2));
