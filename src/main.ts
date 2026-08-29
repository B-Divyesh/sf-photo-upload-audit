import './styles.css';
import type { AuditResult, AuditStatus, MediaFile, ScanProgress } from './types';
import { compareLibraries, resultToCsv, summary, toMediaFile, toMediaFiles } from './lib/audit';
import { makeSampleAudit } from './lib/sample';
import { captureLicenseFromUrl, checkoutUrl, licenseState, storeLicense } from './lib/license';

const app = document.querySelector<HTMLDivElement>('#app')!;
const state: {
  source: MediaFile[];
  destination: MediaFile[];
  result?: AuditResult;
  progress?: ScanProgress;
  busy: boolean;
  error: string;
  filter: AuditStatus | 'all';
  demo: boolean;
  paid: boolean;
  receiptNote: string;
} = { source: [], destination: [], busy: false, error: '', filter: 'all', demo: false, paid: false, receiptNote: '' };

type DirectoryEntry = DirectoryHandle | { kind: 'file'; getFile(): Promise<File> };
type DirectoryHandle = { name: string; kind: 'directory'; entries(): AsyncIterableIterator<[string, DirectoryEntry]>; isSameEntry(other: DirectoryHandle): Promise<boolean> };
const directoryHandles: Partial<Record<'source' | 'destination', DirectoryHandle>> = {};
const folderIdentity: Partial<Record<'source' | 'destination', 'verified' | 'unverified'>> = {};
let downloadRequest: AbortController | undefined;
let releaseMemoryCache: { at: number; data: Release } | undefined;

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Photo Upload Audit — Check photo backups', description: 'Check a camera export against a backup folder. Find missing, changed, skipped, duplicate, and unpaired Live Photo files.' },
  '/demo': { title: 'Demo — Photo Upload Audit', description: 'Try a complete photo backup audit with sample files.' },
  '/audit': { title: 'Audit folders — Photo Upload Audit', description: 'Choose two local folders. Supported media is compared by SHA-256, and unchecked files stay visible.' },
  '/history': { title: 'Saved receipts — Photo Upload Audit', description: 'Review saved local photo backup audit receipts.' },
  '/privacy': { title: 'Privacy — Photo Upload Audit', description: 'How Photo Upload Audit handles files and license data.' },
  '/terms': { title: 'Terms — Photo Upload Audit', description: 'Terms for using Photo Upload Audit.' },
  '/404': { title: 'Page not found — Photo Upload Audit', description: 'This page could not be found.' },
};

const icon = `<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M6 4h16l4 4v18H6z"/><path d="m11 16 3 3 7-8"/><path d="M22 4v5h4"/></svg>`;

function currentPath(): string {
  if (new URLSearchParams(location.search).get('demo') === '1') return '/demo';
  const path = location.pathname.replace(/\/+$/, '') || '/';
  return routeMeta[path] ? path : '/404';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}

async function nav(path: string): Promise<void> {
  if (path !== '/') downloadRequest?.abort();
  if (state.demo && path !== '/demo') resetDemoState();
  history.pushState({}, '', path);
  if (path === '/demo') state.result = undefined;
  // Render the new route before an optional license check. This prevents the
  // just-discarded demo receipt from lingering on screen while that network
  // request settles.
  await render(true);
  await syncLicense(path);
}

function shell(content: string, path: string): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${state.demo ? `<aside class="demo-bar" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved</span><span class="demo-actions"><button class="text-button" data-action="reset-demo">Reset demo</button><a href="/audit" data-action="start-real">Start for real</a></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-nav aria-label="Photo Upload Audit home">${icon}<span>Photo Upload Audit</span></a>
      <nav aria-label="Main navigation">
        <a href="/demo" data-nav ${path === '/demo' ? 'aria-current="page"' : ''}>Demo</a>
        <a href="/audit" data-nav ${path === '/audit' ? 'aria-current="page"' : ''}>Audit</a>
        <a href="/history" data-nav ${path === '/history' ? 'aria-current="page"' : ''}>History</a>
        <a href="/privacy" data-nav ${path === '/privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      </nav>
    </header>
    <main id="main" tabindex="-1">${content}</main>
    <footer>
      <div><a class="wordmark footer-mark" href="/" data-nav>${icon}<span>Photo Upload Audit</span></a><p>Check your backup before clearing your phone.</p></div>
      <nav aria-label="Footer navigation"><a href="/privacy" data-nav>Privacy</a><a href="/terms" data-nav>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
      <p class="build" data-build-id="${__BUILD_ID__}">v${__APP_VERSION__} · build ${__BUILD_ID__.slice(0, 12)} · desktop app · files stay on your device</p>
    </footer>
    <div class="route-announcer sr-only" aria-live="polite"></div>`;
}

function home(): string {
  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Compare a camera export with its backup</p>
        <h1>Check which photos reached your backup</h1>
        <p class="lede">For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.</p>
        <div class="hero-action">
          <a class="button primary" href="/demo" data-nav>Try it with sample data</a>
          <span>See a finished audit in one click.</span>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li>${checkIcon()} Files stay on this device</li>
          <li>${checkIcon()} Works without an account</li>
          <li>${checkIcon()} Core audit and CSV are free</li>
        </ul>
      </div>
      <picture class="hero-art">
        <source media="(max-width: 700px)" srcset="/art/verification-landscape-960.webp" />
        <img src="/art/verification-landscape-1440.webp" width="1440" height="960" alt="Two glass photo archives connected by a bright verification path." fetchpriority="high" decoding="async" />
      </picture>
      <div class="hero-receipt" aria-label="Sample audit summary">
        <span>SCAN 07/14</span><strong>6 source files</strong><span class="result-ok">2 verified</span><span class="result-warn">2 need attention</span>
      </div>
    </section>
    <section class="preview section-grid" aria-labelledby="preview-title">
      <div class="section-intro"><p class="eyebrow">The receipt</p><h2 id="preview-title">See which files match or need attention</h2><p>The app compares each supported file’s contents, even when its name changed.</p><a class="arrow-link" href="/audit" data-nav>Audit your folders <span aria-hidden="true">→</span></a></div>
      ${miniReceipt()}
    </section>
    <section class="how section-grid" aria-labelledby="how-title">
      <div class="section-intro"><p class="eyebrow">How it works</p><h2 id="how-title">Compare without changing either folder</h2></div>
      <ol class="steps">
        <li><span>01</span><div><h3>Choose the export</h3><p>Select the folder copied from your phone.</p></div></li>
        <li><span>02</span><div><h3>Choose the backup</h3><p>Select the disk or server folder that should contain it.</p></div></li>
        <li><span>03</span><div><h3>Read the receipt</h3><p>Review missing, changed, duplicate, extra, and unpaired files.</p></div></li>
      </ol>
    </section>
    <section class="walkthrough" aria-labelledby="walkthrough-title">
      <div class="section-intro"><p class="eyebrow">Folder comparison walkthrough</p><h2 id="walkthrough-title">Compare two folders in three steps</h2></div>
      <div class="frames">
        ${walkFrame('1', 'Pick both folders', 'Source is always first.', '<span class="folder-glyph">EXPORT</span><span class="flow-line"></span><span class="folder-glyph destination">BACKUP</span>')}
        ${walkFrame('2', 'Follow the file check', 'The current file and count stay visible.', '<span class="frame-count">4,812 / 9,204</span><span class="frame-bar"><i></i></span>')}
        ${walkFrame('3', 'Review files that need attention', 'Each row says what happened.', '<span class="frame-row missing">Missing · IMG_1844.HEIC</span><span class="frame-row changed">Changed · IMG_1843.HEIC</span>')}
      </div>
    </section>
    ${downloadsSection()}
    <section class="boundaries section-grid" aria-labelledby="privacy-title">
      <div class="section-intro"><p class="eyebrow">Privacy and backup limits</p><h2 id="privacy-title">Your photo data stays on your device</h2></div>
      <div class="boundary-copy"><p>The app reads the folders you choose. It never moves, edits, or deletes media.</p><p>No photo index or filename is sent to us. License checks send only the license token.</p><p>It checks two folders. Keep your existing backup and complete a restore test.</p></div>
    </section>
    ${paidSection()}`;
}

function checkIcon(): string {
  return `<svg aria-hidden="true" viewBox="0 0 20 20"><path d="m4 10 4 4 8-9"/></svg>`;
}

function miniReceipt(): string {
  const rows = [
    ['verified', 'IMG_1842.HEIC', 'File contents match'],
    ['missing', 'IMG_1844.HEIC', 'No backup file'],
    ['changed', 'IMG_1843.HEIC', 'Same name, different contents'],
    ['duplicate', 'IMG_1845.HEIC', '2 matching copies'],
  ];
  return `<div class="mini-receipt"><div class="receipt-head"><span>STATUS</span><span>CAMERA EXPORT</span><span>RESULT</span></div>${rows.map(([status, name, note]) => `<div class="receipt-row"><span class="status ${status}">${status}</span><strong>${name}</strong><span>${note}</span></div>`).join('')}</div>`;
}

function walkFrame(number: string, title: string, text: string, visual: string): string {
  return `<figure><div class="frame-visual">${visual}</div><figcaption><span>${number}</span><div><strong>${title}</strong><p>${text}</p></div></figcaption></figure>`;
}

function downloadsSection(): string {
  return `<section class="downloads section-grid" aria-labelledby="download-title"><div class="section-intro"><p class="eyebrow">Desktop app</p><h2 id="download-title">Download the desktop app</h2><p>Desktop installers for v${__APP_VERSION__} are unsigned.</p></div><div class="download-panel" data-downloads><div class="download-status"><span class="spinner" aria-hidden="true"></span><p>Checking desktop releases…</p></div><a class="arrow-link" href="https://github.com/B-Divyesh/sf-photo-upload-audit/releases" rel="external">View all releases <span class="sr-only">(external site)</span></a></div></section>`;
}

function paidSection(): string {
  return `<section class="paid section-grid" aria-labelledby="paid-title"><div class="section-intro"><p class="eyebrow">Archive License</p><h2 id="paid-title">Keep up to 25 audit receipts</h2><p>$19 one-time. Save up to 25 local audit receipts and print verification certificates. Scanning and CSV export stay free.</p></div><div class="license-panel"><p class="license-price"><strong>$19</strong><span>one-time purchase</span></p><a class="button primary" href="${checkoutUrl}" rel="external">Buy Archive License <span class="external-label">(external checkout)</span></a><a class="text-link" href="/history" data-nav>Review saved receipts</a><button class="text-button" data-action="show-license">Enter license token</button><form class="license-form" data-license-form hidden><label for="license-token">License token</label><div><input id="license-token" name="license" autocomplete="off" required /><button class="button secondary" type="submit">Verify license</button></div><p class="form-note" data-license-note aria-live="polite"></p></form><p class="fine-print">Sociobot/Dodo processes your payment. <a href="mailto:support@sociobot.in">Email support@sociobot.in</a> with billing questions.</p></div></section>`;
}

function auditPage(): string {
  const title = state.demo ? 'Find gaps in a photo backup' : 'Compare two photo folders';
  const intro = state.demo ? 'This sample includes one missing file, one changed file, a duplicate, and a complete Live Photo.' : 'Choose a camera export and its backup. The receipt lists every selected file and marks types it cannot check as skipped.';
  return `<section class="workbench-page">
    <div class="workbench-heading"><p class="eyebrow">${state.demo ? 'Sample audit' : 'New audit'}</p><h1>${title}</h1><p>${intro}</p></div>
    ${state.demo || state.result ? resultView() : pickerView()}
  </section>`;
}

function pickerView(): string {
  const progress = state.progress;
  return `<section class="picker-shell" aria-label="Folder comparison">
    <div class="folder-pickers">
      ${folderPicker('source', '1 · Camera export', state.source)}
      <div class="compare-mark" aria-hidden="true">→</div>
      ${folderPicker('destination', '2 · Backup folder', state.destination)}
    </div>
    ${state.error ? `<div class="error-message" role="alert"><strong>The audit did not start.</strong><span>${escapeHtml(state.error)}</span></div>` : ''}
    ${state.busy && progress ? `<div class="scan-progress" role="status" aria-live="polite"><div><span>${progress.stage === 'compare' ? 'Comparing files' : `Hashing ${progress.stage}`}</span><strong>${progress.current} / ${progress.total}</strong></div><progress max="${Math.max(progress.total, 1)}" value="${progress.current}"></progress><p>${escapeHtml(progress.fileName || 'Building the receipt…')}</p><i class="scan-beam" aria-hidden="true"></i></div>` : `<div class="scan-action"><button class="button primary" data-action="scan" ${state.source.length && state.destination.length ? '' : 'disabled'}>Create audit receipt</button><span>Read-only. Large folders can take time.</span></div>`}
  </section>`;
}

function folderPicker(kind: 'source' | 'destination', label: string, files: MediaFile[]): string {
  const checked = files.filter((file) => file.supported !== false).length;
  const skipped = files.length - checked;
  const description = files.length ? `${files.length.toLocaleString()} selected files: ${checked.toLocaleString()} ready${skipped ? `, ${skipped.toLocaleString()} will be listed as skipped` : ''}` : 'No folder chosen';
  const controlLabel = `Choose ${kind === 'source' ? 'export' : 'backup'} folder`;
  const supportsVerifiedPicker = typeof (window as Window & { showDirectoryPicker?: unknown }).showDirectoryPicker === 'function';
  const verifiedPicker = supportsVerifiedPicker
    ? `<button class="button secondary" data-action="choose-folder" data-folder-kind="${kind}">${controlLabel}</button><p class="picker-note">This picker checks folder identity before an all-clear.</p><input id="${kind}-folder" type="file" webkitdirectory multiple data-folder="${kind}" hidden tabindex="-1" aria-hidden="true" />`
    : `<label class="folder-input-label" for="${kind}-folder">Choose files from a folder on your device</label><input class="folder-input" id="${kind}-folder" type="file" webkitdirectory multiple data-folder="${kind}" aria-describedby="${kind}-folder-help ${kind}-identity-note" /><p class="picker-note identity-note" id="${kind}-identity-note">Browser folder inputs cannot verify folder identity. Their receipts never issue an all-clear.</p>`;
  return `<div class="folder-picker ${files.length ? 'has-files' : ''}"><span class="folder-number">${label}</span><strong>${kind === 'source' ? 'What left the phone' : 'Where it should be'}</strong><p id="${kind}-folder-help">${description}</p>${verifiedPicker}</div>`;
}

function resultView(): string {
  if (!state.result) return `<div class="loading-receipt" role="status">Preparing sample receipt…</div>`;
  const counts = summary(state.result);
  const shown = state.filter === 'all' ? state.result.rows : state.result.rows.filter((row) => row.status === state.filter);
  const sourceIssues = state.result.rows.filter((row) => Boolean(row.source) && ['missing', 'changed', 'skipped'].includes(row.status)).length;
  // Receipts saved before this field existed cannot prove the directory
  // relationship either. Treat missing provenance as unverified on reload.
  const identityUnverified = state.result.folderIdentity !== 'verified' && state.result.folderIdentity !== 'demo';
  const resultHeading = identityUnverified
    ? 'Folder identity could not be verified'
    : sourceIssues === 0
      ? 'No source files need attention'
      : `${sourceIssues} source file${sourceIssues === 1 ? '' : 's'} need${sourceIssues === 1 ? 's' : ''} attention`;
  const identityNotice = identityUnverified
    ? `<p class="identity-warning" role="alert"><strong>This receipt cannot confirm your backup.</strong> Choose both folders with a verified folder picker to confirm they are different folders.</p>`
    : '';
  const filters: Array<AuditStatus | 'all'> = ['all', 'missing', 'changed', 'skipped', 'duplicate', 'extra', 'verified'];
  return `<section class="results" aria-labelledby="receipt-title">
    <div class="receipt-title"><div><p class="eyebrow">Audit receipt · ${new Date(state.result.createdAt).toLocaleDateString()}</p><h2 id="receipt-title">${resultHeading}</h2>${identityNotice}${state.receiptNote ? `<p class="receipt-note" role="status">${escapeHtml(state.receiptNote)}</p>` : ''}</div><div class="receipt-actions"><button class="button secondary" data-action="export-csv">Export CSV</button>${state.paid && !state.demo && !identityUnverified ? '<button class="button secondary" data-action="save-receipt">Save receipt</button><button class="button secondary" data-action="print">Print certificate</button>' : ''}${!state.demo ? '<button class="text-button" data-action="new-audit">Start another audit</button>' : ''}</div></div>
    <dl class="summary-strip"><div><dt>Source files</dt><dd>${state.result.sourceCount}</dd></div><div class="verified"><dt>Verified</dt><dd>${counts.verified}</dd></div><div class="missing"><dt>Missing</dt><dd>${counts.missing}</dd></div><div class="changed"><dt>Changed</dt><dd>${counts.changed}</dd></div><div class="skipped"><dt>Skipped</dt><dd>${counts.skipped}</dd></div><div class="duplicate"><dt>Duplicates</dt><dd>${counts.duplicate}</dd></div><div><dt>Unpaired</dt><dd>${counts.unpaired}</dd></div></dl>
    <div class="result-context"><span><strong>Source:</strong> ${escapeHtml(state.result.sourceLabel)}</span><span><strong>Backup:</strong> ${escapeHtml(state.result.destinationLabel)}</span></div>
    <div class="filters" aria-label="Filter results">${filters.map((filter) => `<button aria-pressed="${state.filter === filter}" data-filter="${filter}">${filter === 'all' ? `All ${state.result!.rows.length}` : `${filter} ${counts[filter as keyof typeof counts] ?? ''}`}</button>`).join('')}</div>
    <div class="table-wrap"><table><caption class="sr-only">File audit results</caption><thead><tr><th scope="col">Status</th><th scope="col">Source file</th><th scope="col">Backup match</th><th scope="col">Evidence</th></tr></thead><tbody>${shown.map((row) => `<tr><td data-label="Status"><span class="status ${row.status}">${row.status}</span></td><td data-label="Source file"><strong class="filename">${escapeHtml(row.source?.name ?? '—')}</strong><span class="path">${escapeHtml(row.source?.relativePath ?? 'Only in backup')}</span></td><td data-label="Backup match"><strong class="filename">${escapeHtml(row.destinations[0]?.name ?? '—')}</strong><span class="path">${escapeHtml(row.destinations.map((file) => file.relativePath).join(' · ') || 'No match')}</span></td><td data-label="Evidence"><span>${escapeHtml(row.note)}</span>${row.livePair !== 'not-live' ? `<small>Live Photo: ${row.livePair}</small>` : ''}</td></tr>`).join('')}</tbody></table>${shown.length === 0 ? `<div class="empty-filter"><strong>No ${state.filter} files</strong><p>Choose another filter to see the rest of the receipt.</p></div>` : ''}</div>
  </section>`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  if (kind === 'privacy') return `<article class="legal"><p class="eyebrow">Policy</p><h1>Privacy without a photo upload</h1><p class="updated">Effective 28 August 2026</p><h2>Files stay local</h2><p>Photo Upload Audit reads only the folders you choose. Media contents, names, hashes, and reports are not sent to us.</p><h2>Data stored on your device</h2><p>The web app stores its offline shell. A paid license can also store audit receipts in your browser. Demo data uses memory only and is discarded when you leave demo mode.</p><h2>License checks</h2><p>If you add a license, the app sends that token to the Sociobot billing API. It does not send photo data with the request.</p><h2>No analytics</h2><p>This version has no analytics, advertising, or tracking scripts.</p><h2>Your choices</h2><p>Use Clear saved data to remove the saved license and audit receipts from this browser.</p><button class="button secondary" data-action="request-clear-saved-data">Clear saved data</button><div class="clear-data-confirm" data-clear-data-confirm hidden><p id="clear-data-warning">This removes the saved license and all saved audit receipts from this browser.</p><div><button class="button danger-action" data-action="clear-saved-data" aria-describedby="clear-data-warning">Remove saved data</button><button class="button secondary" data-action="cancel-clear-saved-data">Cancel</button></div></div><p class="form-note" data-clear-data-note aria-live="polite"></p><p>Uninstalling may leave local app data behind. Check your operating system's app-data location before sharing the computer.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with a privacy question.</p></article>`;
  return `<article class="legal"><p class="eyebrow">Terms</p><h1>Terms for using the audit</h1><p class="updated">Effective 28 August 2026</p><h2>What the app does</h2><p>The app compares selected files and reports what it finds.</p><h2>Your responsibility</h2><p>Keep a second backup and complete a restore test before deleting originals.</p><h2>Archive License</h2><p>The Archive License costs $19 once. It adds saved receipts and printable certificates. Sociobot/Dodo processes your payment. Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with billing questions.</p><h2>Warranty</h2><p>The software is provided as-is under the MIT License. We do not promise that storage hardware, operating systems, or unrelated backup tools will work.</p><h2>Acceptable use</h2><p>Do not use the billing service unlawfully or try to bypass license checks.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with a terms question.</p></article>`;
}

function receiptHistory(): AuditResult[] {
  try { return JSON.parse(localStorage.getItem('audit:receipts') || '[]') as AuditResult[]; } catch { return []; }
}

function historyPage(): string {
  const receipts = receiptHistory();
  return `<section class="workbench-page history-page"><div class="workbench-heading"><p class="eyebrow">Archive License</p><h1>Review saved audit receipts</h1><p>Saved receipts stay in this browser. They do not include the original media files.</p></div>${receipts.length ? `<ol class="receipt-history">${receipts.map((receipt, index) => { const sourceIssues = receipt.rows.filter((row) => Boolean(row.source) && ['missing', 'changed', 'skipped'].includes(row.status)).length; return `<li><div><strong>${escapeHtml(receipt.sourceLabel)} → ${escapeHtml(receipt.destinationLabel)}</strong><span>${new Date(receipt.createdAt).toLocaleString()} · ${receipt.sourceCount} source files · ${sourceIssues} need attention</span></div><div><button class="button secondary" data-open-receipt="${index}">Open receipt</button><button class="text-button danger-button" data-delete-receipt="${index}">Remove</button></div></li>`; }).join('')}</ol>` : `<section class="empty-history"><h2>No saved receipts yet</h2><p>Complete an audit, then use Save receipt to keep it here.</p><a class="button primary" href="/audit" data-nav>Start an audit</a></section>`}</section>`;
}

function notFound(): string {
  return `<section class="not-found"><div class="lost-pane" aria-hidden="true"><span></span><span></span><span></span><i>?</i></div><p class="eyebrow">404 · unmatched path</p><h1>This page is missing from the archive</h1><p>The address does not match any page in this app.</p><a class="button primary" href="/" data-nav>Return home</a></section>`;
}

async function render(focusHeading = false): Promise<void> {
  const path = currentPath();
  const changingDemoMode = state.demo !== (path === '/demo');
  state.demo = path === '/demo';
  const meta = routeMeta[path];
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', meta.description);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', meta.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', meta.description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://photo-upload-audit.sociobot.in${path === '/' ? '/' : path}`);
  if (state.demo && (changingDemoMode || !state.result)) state.result = await makeSampleAudit();
  if (!state.demo && path !== '/audit') state.result = undefined;
  const content = path === '/' ? home() : path === '/demo' || path === '/audit' ? auditPage() : path === '/history' ? historyPage() : path === '/privacy' ? legalPage('privacy') : path === '/terms' ? legalPage('terms') : notFound();
  app.innerHTML = shell(content, path);
  bindEvents();
  if (path === '/') void loadDownloads();
  if (focusHeading) {
    const heading = document.querySelector<HTMLElement>('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
    document.querySelector('.route-announcer')!.textContent = heading?.textContent ?? '';
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
}

function bindEvents(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void nav(link.pathname);
  }));
  document.querySelectorAll<HTMLInputElement>('[data-folder]').forEach((input) => input.addEventListener('change', () => {
    const kind = input.dataset.folder as 'source' | 'destination';
    delete directoryHandles[kind];
    folderIdentity[kind] = 'unverified';
    state[kind] = toMediaFiles(input.files ?? []);
    state.error = state[kind].length ? '' : 'That folder contains no files. Choose a folder that contains files.';
    void render();
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-action="choose-folder"]').forEach((button) => button.addEventListener('click', () => void chooseDirectory(button.dataset.folderKind as 'source' | 'destination')));
  document.querySelector('[data-action="start-real"]')?.addEventListener('click', (event) => { event.preventDefault(); resetDemoState(); void nav('/audit'); });
  document.querySelector('[data-action="scan"]')?.addEventListener('click', () => void runScan());
  document.querySelector('[data-action="new-audit"]')?.addEventListener('click', () => { resetDemoState(); void render(); });
  document.querySelector('[data-action="reset-demo"]')?.addEventListener('click', async () => { state.filter = 'all'; state.result = await makeSampleAudit(); await render(); });
  document.querySelector('[data-action="export-csv"]')?.addEventListener('click', exportCsv);
  document.querySelector('[data-action="save-receipt"]')?.addEventListener('click', saveReceipt);
  document.querySelector('[data-action="print"]')?.addEventListener('click', () => print());
  document.querySelector('[data-action="request-clear-saved-data"]')?.addEventListener('click', () => {
    document.querySelector<HTMLElement>('[data-clear-data-confirm]')!.hidden = false;
    document.querySelector<HTMLElement>('[data-action="request-clear-saved-data"]')!.hidden = true;
    document.querySelector<HTMLButtonElement>('[data-action="clear-saved-data"]')?.focus();
  });
  document.querySelector('[data-action="cancel-clear-saved-data"]')?.addEventListener('click', () => {
    document.querySelector<HTMLElement>('[data-clear-data-confirm]')!.hidden = true;
    const request = document.querySelector<HTMLElement>('[data-action="request-clear-saved-data"]')!;
    request.hidden = false;
    request.focus();
  });
  document.querySelector('[data-action="clear-saved-data"]')?.addEventListener('click', clearSavedData);
  document.querySelectorAll<HTMLButtonElement>('[data-open-receipt]').forEach((button) => button.addEventListener('click', () => {
    const receipt = receiptHistory()[Number(button.dataset.openReceipt)];
    if (!receipt) return;
    state.result = receipt; state.filter = 'all'; void nav('/audit');
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-delete-receipt]').forEach((button) => button.addEventListener('click', () => {
    const history = receiptHistory();
    history.splice(Number(button.dataset.deleteReceipt), 1);
    localStorage.setItem('audit:receipts', JSON.stringify(history));
    void render();
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => button.addEventListener('click', () => { state.filter = button.dataset.filter as typeof state.filter; void render(); }));
  document.querySelector('[data-action="show-license"]')?.addEventListener('click', () => {
    const form = document.querySelector<HTMLFormElement>('[data-license-form]');
    if (form) { form.hidden = false; form.querySelector<HTMLInputElement>('input')?.focus(); }
  });
  document.querySelector<HTMLFormElement>('[data-license-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = new FormData(event.currentTarget as HTMLFormElement).get('license')?.toString().trim() ?? '';
    const note = document.querySelector('[data-license-note]');
    if (!input) return;
    storeLicense(input);
    if (note) note.textContent = 'License saved. Checking it now…';
    const current = await licenseState();
    state.paid = current.active;
    if (note) note.textContent = current.note;
  });
}

async function runScan(): Promise<void> {
  if (!state.source.length || !state.destination.length) { state.error = 'Choose both a camera export and backup folder, then compare again.'; await render(); return; }
  const sourceHandle = directoryHandles.source;
  const destinationHandle = directoryHandles.destination;
  const verifiedFolders = folderIdentity.source === 'verified' && folderIdentity.destination === 'verified' && Boolean(sourceHandle && destinationHandle);
  if (verifiedFolders && sourceHandle && destinationHandle) {
    if (await sourceHandle.isSameEntry(destinationHandle)) {
      state.error = 'The source and backup folder are the same folder. Choose a different backup folder, then compare again.';
      await render();
      return;
    }
  }
  state.busy = true;
  state.error = '';
  state.progress = { stage: 'source', current: 0, total: state.source.length, fileName: '' };
  await render();
  try {
    state.result = await compareLibraries(state.source, state.destination, {
      source: rootLabel(state.source),
      destination: rootLabel(state.destination),
      folderIdentity: verifiedFolders ? 'verified' : 'unverified',
    }, (progress) => {
      state.progress = progress;
      updateProgress(progress);
    });
  } catch (error) {
    state.error = error instanceof Error ? `${error.message}.` : 'A file could not be read.';
  } finally {
    state.busy = false;
    state.progress = undefined;
    await render();
  }
}

function rootLabel(files: MediaFile[]): string {
  const first = files[0]?.relativePath ?? 'Selected folder';
  return first.includes('/') ? first.split('/')[0] : 'Selected folder';
}

function resetDemoState(): void {
  state.result = undefined;
  state.source = [];
  state.destination = [];
  state.filter = 'all';
  state.progress = undefined;
  state.error = '';
  state.receiptNote = '';
  delete directoryHandles.source;
  delete directoryHandles.destination;
  delete folderIdentity.source;
  delete folderIdentity.destination;
}

async function chooseDirectory(kind: 'source' | 'destination'): Promise<void> {
  const picker = (window as Window & { showDirectoryPicker?: () => Promise<DirectoryHandle> }).showDirectoryPicker;
  if (!picker) return;
  try {
    const handle = await picker();
    directoryHandles[kind] = handle;
    folderIdentity[kind] = 'verified';
    state[kind] = await filesFromDirectory(handle);
    state.error = state[kind].length ? '' : 'That folder contains no files. Choose a folder that contains files.';
    await render();
  } catch (error) {
    if ((error as DOMException).name !== 'AbortError') { state.error = 'That folder could not be read. Choose that folder again.'; await render(); }
  }
}

async function filesFromDirectory(handle: DirectoryHandle, prefix = handle.name): Promise<MediaFile[]> {
  const files: MediaFile[] = [];
  for await (const [name, entry] of handle.entries()) {
    if (entry.kind === 'directory') files.push(...await filesFromDirectory(entry, `${prefix}/${name}`));
    else {
      const file = await entry.getFile();
      const relativePath = `${prefix}/${name}`;
      files.push(toMediaFile(file, files.length, relativePath));
    }
  }
  return files;
}

function updateProgress(progress: ScanProgress): void {
  const element = document.querySelector<HTMLProgressElement>('progress');
  if (element) { element.max = Math.max(progress.total, 1); element.value = progress.current; }
  const panel = document.querySelector('.scan-progress');
  if (panel) panel.querySelector('strong')!.textContent = `${progress.current} / ${progress.total}`;
  if (panel) panel.querySelector('p')!.textContent = progress.fileName || 'Building the receipt…';
  if (panel) panel.querySelector('span')!.textContent = progress.stage === 'compare' ? 'Comparing files' : `Hashing ${progress.stage}`;
}

function download(content: string, type: string, name: string): void {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([content], { type }));
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
}

function exportCsv(): void {
  if (state.result) download(resultToCsv(state.result), 'text/csv;charset=utf-8', `photo-upload-audit-${state.result.createdAt.slice(0, 10)}.csv`);
}

function saveReceipt(): void {
  if (!state.result || state.demo) return;
  const safeResult = JSON.parse(JSON.stringify(state.result, (key, value) => key === 'file' ? undefined : value));
  const history = receiptHistory();
  if (history.length >= 25) {
    state.receiptNote = 'Your 25 saved receipt limit is full. Remove a saved receipt before adding another.';
    void render();
    return;
  }
  localStorage.setItem('audit:receipts', JSON.stringify([safeResult, ...history]));
  state.receiptNote = 'Receipt saved locally. Open receipt history to review it.';
  const button = document.querySelector<HTMLButtonElement>('[data-action="save-receipt"]');
  if (button) { button.textContent = 'Receipt saved'; button.disabled = true; }
}

function clearSavedData(): void {
  localStorage.removeItem('audit:receipts');
  localStorage.removeItem('sb_license:photo-upload-audit');
  localStorage.removeItem('sb_license_verdict:photo-upload-audit');
  state.paid = false;
  const note = document.querySelector<HTMLElement>('[data-clear-data-note]');
  if (note) note.textContent = 'Saved license and audit receipts cleared from this browser.';
}

async function loadDownloads(): Promise<void> {
  const panel = document.querySelector<HTMLElement>('[data-downloads]');
  if (!panel) return;
  const platform = /Mac/i.test(navigator.userAgent) ? 'macOS' : /Windows/i.test(navigator.userAgent) ? 'Windows' : 'Linux';
  const controller = new AbortController();
  downloadRequest = controller;
  try {
    if (['127.0.0.1', 'localhost'].includes(location.hostname) && !new URLSearchParams(location.search).has('release-preview')) throw new Error('Skip release lookup in local development');
    let release: Release;
    if (releaseMemoryCache && Date.now() - releaseMemoryCache.at < 3_600_000) release = releaseMemoryCache.data;
    else {
      const response = await fetch('https://api.github.com/repos/B-Divyesh/sf-photo-upload-audit/releases/latest', { signal: controller.signal });
      if (!response.ok) throw new Error('No release');
      release = await response.json() as Release;
      if (controller.signal.aborted || currentPath() !== '/' || !panel.isConnected) return;
      releaseMemoryCache = { at: Date.now(), data: release };
    }
    if (controller.signal.aborted || currentPath() !== '/' || !panel.isConnected) return;
    if (release.tag_name !== `v${__APP_VERSION__}` || release.target_commitish !== __BUILD_ID__) throw new Error('Release does not match this build');
    if (platform === 'macOS') {
      const arm = release.assets.find((item) => /aarch64.*\.dmg$/i.test(item.name));
      const intel = release.assets.find((item) => /x64.*\.dmg$/i.test(item.name));
      if (!arm || !intel) throw new Error('No complete macOS assets');
      panel.innerHTML = `<p class="detected">Detected: macOS · choose your processor</p><div class="mac-downloads"><a class="button primary" href="${arm.browser_download_url}">Download for Apple silicon</a><a class="button secondary" href="${intel.browser_download_url}">Download for Intel</a></div><p class="download-note">${release.tag_name} · unsigned</p><a class="arrow-link" href="${release.html_url}" rel="external">View all releases <span class="sr-only">(external site)</span></a>`;
      return;
    }
    const matchers = platform === 'Windows' ? [/\.msi$/i, /\.exe$/i] : [/\.AppImage$/i, /\.deb$/i];
    const asset = matchers.flatMap((pattern) => release.assets.filter((item) => pattern.test(item.name))).at(0);
    if (!asset) throw new Error('No platform asset');
    panel.innerHTML = `<p class="detected">Detected: ${platform}</p><a class="button primary" href="${asset.browser_download_url}">Download for ${platform}</a><p class="download-note">${escapeHtml(asset.name)} · ${release.tag_name}</p><a class="arrow-link" href="${release.html_url}" rel="external">View all releases <span class="sr-only">(external site)</span></a>`;
  } catch {
    if (controller.signal.aborted || currentPath() !== '/' || !panel.isConnected) return;
    panel.innerHTML = `<p class="download-wait"><strong>Desktop downloads are being published.</strong><span>The browser version is ready now. Release files will appear on GitHub.</span></p><a class="button secondary" href="/audit" data-nav>Use the browser version</a><a class="arrow-link" href="https://github.com/B-Divyesh/sf-photo-upload-audit/releases" rel="external">View release page <span class="sr-only">(external site)</span></a>`;
  } finally {
    if (downloadRequest === controller) downloadRequest = undefined;
  }
}

interface Release { tag_name: string; target_commitish: string; html_url: string; assets: Array<{ name: string; browser_download_url: string }> }

async function syncLicense(path: string): Promise<void> {
  if (path === '/demo') { state.paid = false; return; }
  captureLicenseFromUrl();
  state.paid = (await licenseState()).active;
}

window.addEventListener('popstate', () => {
  const path = currentPath();
  // Back/forward can leave the demo without going through nav(). Keep the
  // sandbox boundary intact in that path as well.
  if (state.demo && path !== '/demo') resetDemoState();
  void render(true).then(() => syncLicense(path));
});

async function start(): Promise<void> {
  await syncLicense(currentPath());
  await render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
}

void start();
