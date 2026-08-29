import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

const fixture = (name: string) => path.resolve('tests/fixtures', name);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'showDirectoryPicker', { configurable: true, value: undefined }));
});

for (const route of ['/', '/demo', '/audit', '/history', '/privacy', '/terms', '/does-not-exist']) {
  test(`route ${route} has one h1 and no serious accessibility violations`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Photo Upload Audit/);
    await expect(page.getByRole('link', { name: 'Privacy', exact: true }).last()).toHaveAttribute('href', '/privacy');
    await expect(page.getByRole('link', { name: 'Terms', exact: true })).toHaveAttribute('href', '/terms');
    const results = await new AxeBuilder({ page: page as never }).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('first screen states the job, audience, sample action, outcome, and three facts', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const firstScreen = [
      page.getByRole('heading', { level: 1, name: 'Check every photo before clearing space' }),
      page.getByText('For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.'),
      page.getByRole('link', { name: 'Try it with sample data' }),
      page.getByText('See a finished audit in one click.'),
      page.getByText('Files stay on this device'),
      page.getByText('Works without an account'),
      page.getByText('Core audit and CSV are free'),
    ];
    for (const item of firstScreen) {
      await expect(item).toBeVisible();
      const box = await item.boundingBox();
      expect(box && box.y >= 0 && box.y + box.height <= viewport.height).toBe(true);
    }
  }
});

test('mobile demo fits a 390px viewport and remains operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'missing 1' }).click();
  await expect(page.getByText('IMG_1844.MOV', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('every visible phone interaction has a 44px target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const tooSmall: Array<{ route: string; name: string; width: number; height: number }> = [];
  for (const route of ['/', '/demo', '/audit', '/history', '/privacy', '/terms', '/does-not-exist']) {
    await page.goto(route);
    tooSmall.push(...await page.locator('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"]').evaluateAll((elements, currentRoute) => elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      const hidden = style.display === 'none' || style.visibility === 'hidden' || box.width === 0 || box.height === 0;
      if (hidden || box.width >= 44 && box.height >= 44) return [];
      return [{ route: currentRoute, name: (element.getAttribute('aria-label') || element.textContent || element.getAttribute('id') || element.tagName).trim(), width: box.width, height: box.height }];
    }), route));
  }
  expect(tooSmall).toEqual([]);
});

test('meaningful phone copy is at least 16px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const selectors = [
    '.demo-bar', '.hero-action span', '.plain-facts li', '.section-intro > p:not(.eyebrow)', '.receipt-row > span:last-child',
    '.steps p', '.frames figcaption p', '.download-status p', '.download-wait span', '.detected', '.download-note',
    '.boundary-copy p', '.fine-print', 'footer p', '.build', '.workbench-heading > p:last-child', '.folder-picker p',
    '.scan-action span', '.error-message span', '.scan-progress p', '.receipt-note', '.summary-strip dt', '.result-context',
    '.path', 'td', '.empty-filter p', '.receipt-history span', '.legal p:not(.eyebrow)', '.form-note',
  ].join(', ');
  const tooSmall: Array<{ route: string; text: string; fontSize: number }> = [];
  for (const route of ['/', '/demo', '/audit', '/history', '/privacy', '/terms', '/does-not-exist']) {
    await page.goto(route);
    tooSmall.push(...await page.locator(selectors).evaluateAll((elements, currentRoute) => elements.flatMap((element) => {
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || element.getBoundingClientRect().height === 0) return [];
      const fontSize = Number.parseFloat(style.fontSize);
      return fontSize >= 16 ? [] : [{ route: currentRoute, text: (element.textContent || element.className).trim().slice(0, 80), fontSize }];
    }), route));
  }
  expect(tooSmall).toEqual([]);
});

test('phone scan progress keeps its status and current filename at 16px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const original = File.prototype.stream;
    File.prototype.stream = function () {
      const stream = original.call(this);
      const reader = stream.getReader();
      return new ReadableStream({ async pull(controller) { await new Promise((resolve) => setTimeout(resolve, 150)); const next = await reader.read(); if (next.done) controller.close(); else controller.enqueue(next.value); } });
    };
  });
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('hash-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('hash-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  const progress = page.locator('.scan-progress');
  await expect(progress).toBeVisible();
  const sizes = await progress.locator('span, strong, p').evaluateAll((elements) => elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
  expect(sizes.every((size) => size >= 16)).toBe(true);
});

test('history navigation restores routes and heading focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('h1')).toBeFocused();
});

test('the ?demo=1 entry point exposes demo metadata after it loads', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Photo Upload Audit');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Try a complete photo backup audit with sample files.');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Demo — Photo Upload Audit');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Demo — Photo Upload Audit');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://photo-upload-audit.sociobot.in/demo');
});

test('@claim:same-folder-safe rejects the same verified folder and withholds an all-clear from browser folder inputs', async ({ page }) => {
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
  await expect(page.getByRole('alert')).toContainText('The source and backup folder are the same folder. Choose a different backup folder, then compare again.');
  await expect(page.getByText('Every source file is accounted for')).toHaveCount(0);
  await page.getByRole('button', { name: 'Choose backup folder' }).click();
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByText('1 source file needs attention')).toBeVisible();

  // Browser folder inputs cannot establish canonical directory identity. They
  // must still scan, but the same-folder path must never become an all-clear.
  await page.addInitScript(() => Object.defineProperty(window, 'showDirectoryPicker', { configurable: true, value: undefined }));
  await page.goto('/audit');
  await expect(page.getByRole('button', { name: 'Choose export folder' })).toHaveCount(0);
  await expect(page.locator('#source-folder')).toBeVisible();
  const selectFallbackFiles = async (sourceBody: string, destinationBody: string) => {
    await page.locator('#source-folder').evaluate((input, body) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([body], 'IMG_0001.jpg', { type: 'image/jpeg', lastModified: 1 }));
      const folderInput = input as HTMLInputElement;
      folderInput.files = transfer.files;
      folderInput.dispatchEvent(new Event('change', { bubbles: true }));
    }, sourceBody);
    await page.locator('#destination-folder').evaluate((input, body) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([body], 'IMG_0001.jpg', { type: 'image/jpeg', lastModified: 1 }));
      const folderInput = input as HTMLInputElement;
      folderInput.files = transfer.files;
      folderInput.dispatchEvent(new Event('change', { bubbles: true }));
    }, destinationBody);
  };
  await selectFallbackFiles('same folder', 'same folder');
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Folder identity could not be verified' })).toBeVisible();
  await expect(page.getByText('This receipt cannot confirm your backup.')).toBeVisible();
  await expect(page.getByText('Every source file is accounted for')).toHaveCount(0);

  // Different folders can commonly share a name such as DCIM. The fallback
  // must not reject them as identical; it simply keeps the honest warning.
  await page.goto('/audit');
  await selectFallbackFiles('camera export', 'different backup');
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Folder identity could not be verified' })).toBeVisible();
  await expect(page.getByRole('alert')).not.toContainText('same folder');
});

test('folder-selection errors name the next action that can fix them', async ({ page }) => {
  await page.goto('/audit');
  await page.locator('#source-folder').evaluate((input) => {
    const transfer = new DataTransfer();
    const folderInput = input as HTMLInputElement;
    folderInput.files = transfer.files;
    folderInput.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.getByRole('alert')).toContainText('That folder contains no files. Choose a folder that contains files.');
});

test('@claim:scan-progress keeps the current file and count visible during hashing', async ({ page }) => {
  await page.addInitScript(() => {
    const original = File.prototype.stream;
    File.prototype.stream = function () {
      const stream = original.call(this);
      const reader = stream.getReader();
      return new ReadableStream({ async pull(controller) { await new Promise((resolve) => setTimeout(resolve, 150)); const next = await reader.read(); if (next.done) controller.close(); else controller.enqueue(next.value); } });
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
  const expectations: Record<string, { route: string; title: string; description: string }> = {
    'index.html': { route: '/', title: 'Photo Upload Audit — Check photo backups', description: 'Check a camera export against a backup folder. Find missing, changed, skipped, duplicate, and unpaired Live Photo files.' },
    'demo.html': { route: '/demo', title: 'Demo — Photo Upload Audit', description: 'Try a complete photo backup audit with sample files.' },
    'audit.html': { route: '/audit', title: 'Audit folders — Photo Upload Audit', description: 'Choose two local folders. Supported media is compared by SHA-256, and unchecked files stay visible.' },
    'history.html': { route: '/history', title: 'Saved receipts — Photo Upload Audit', description: 'Review saved local photo backup audit receipts.' },
    'privacy.html': { route: '/privacy', title: 'Privacy — Photo Upload Audit', description: 'How Photo Upload Audit handles files and license data.' },
    'terms.html': { route: '/terms', title: 'Terms — Photo Upload Audit', description: 'Terms for using Photo Upload Audit.' },
    '404.html': { route: '/404', title: 'Page not found — Photo Upload Audit', description: 'This page could not be found.' },
  };
  for (const [file, expectation] of Object.entries(expectations)) {
    const html = await readFile(`dist/site/${file}`, 'utf8');
    expect(html).toContain(`<title>${expectation.title}</title>`);
    expect(html).toContain(`name="description" content="${expectation.description}"`);
    expect(html).toContain(`rel="canonical" href="https://photo-upload-audit.sociobot.in${expectation.route}"`);
    expect(html).toContain(`property="og:title" content="${expectation.title}"`);
    expect(html).toContain(`property="og:description" content="${expectation.description}"`);
    expect(html).toContain(`name="twitter:title" content="${expectation.title}"`);
    expect(html).toContain(`name="twitter:description" content="${expectation.description}"`);
  }
  const config = JSON.parse(await readFile('dist/site/staticwebapp.config.json', 'utf8')) as { routes: Array<{ route: string; rewrite: string }>; responseOverrides: { '404': { rewrite: string; statusCode: number } } };
  expect(config.routes.filter(({ route }) => ['/demo', '/audit', '/history', '/privacy', '/terms'].includes(route))).toEqual([
    { route: '/demo', rewrite: '/demo.html' },
    { route: '/audit', rewrite: '/audit.html' },
    { route: '/history', rewrite: '/history.html' },
    { route: '/privacy', rewrite: '/privacy.html' },
    { route: '/terms', rewrite: '/terms.html' },
  ]);
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
});

test('@claim:one-to-one-match allocates one backup file to at most one identical source file', async ({ page }) => {
  await page.goto('/audit');
  await page.locator('#source-folder').setInputFiles(fixture('duplicate-source'));
  await page.locator('#destination-folder').setInputFiles(fixture('duplicate-destination'));
  await page.getByRole('button', { name: 'Compare every file' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Folder identity could not be verified' })).toBeVisible();
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

test('landing uses plain preview labels and identifies the external checkout', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Compare a camera export with its backup', { exact: true })).toBeVisible();
  await expect(page.getByText('File contents match', { exact: true })).toBeVisible();
  await expect(page.getByText('Same name, different contents', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Download the desktop app' })).toBeVisible();
  const checkout = page.getByRole('link', { name: 'Buy Archive License (external checkout)' });
  await expect(checkout).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/photo-upload-audit/checkout');
  await expect(checkout).toHaveAttribute('rel', 'external');
  await expect(page.getByText('A receipt for your camera roll', { exact: true })).toHaveCount(0);
  await expect(page.getByText('SHA-256 match', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Same name, different hash', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Install it where your archive lives', { exact: true })).toHaveCount(0);
});

test('landing section labels name their product-specific content', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Folder comparison walkthrough', { exact: true })).toBeVisible();
  await expect(page.getByText('Privacy and backup limits', { exact: true })).toBeVisible();
  await expect(page.getByText('Inside the app', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Clear boundaries', { exact: true })).toHaveCount(0);
});

test('claims manifest has one current test for every declared claim', async () => {
  const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8')) as Array<{ id: string; claim: string; test: string }>;
  const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as { version: string };
  const testSources = `${await readFile('tests/claims.spec.ts', 'utf8')}\n${await readFile('tests/site.spec.ts', 'utf8')}`;
  const ids = claims.map(({ id }) => id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const claim of claims) {
    expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
    expect(testSources.match(new RegExp(`@claim:${claim.id}(?![a-z0-9-])`, 'g'))).toHaveLength(1);
  }
  const declaredTags = [...testSources.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
  expect(new Set(declaredTags)).toEqual(new Set(ids));
  expect(claims.find(({ id }) => id === 'unsigned-installers')?.claim).toBe(`Desktop installers for v${packageJson.version} are unsigned`);
});

test('terms advise safe deletion without claiming to replace a backup, and public copy stays plain', async ({ page }) => {
  for (const route of ['/', '/demo', '/audit', '/history', '/privacy', '/terms', '/does-not-exist']) {
    await page.goto(route);
    await expect(page.getByText(/replaces a second backup|replace your backup tool/i)).toHaveCount(0);
    await expect(page.getByText(/merchant of record|local-first|Live Photo sidecar/i)).toHaveCount(0);
  }
  await page.goto('/terms');
  await expect(page.getByText('Keep a second backup and complete a restore test before deleting originals.')).toBeVisible();
  await expect(page.getByText('Sociobot/Dodo processes your payment.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'support@sociobot.in' }).first()).toHaveAttribute('href', 'mailto:support@sociobot.in');
});
