// Keep the published desktop version in the cache name, then advance the
// static repair generation so an already-installed browser updates its shell.
const CACHE = 'photo-upload-audit-v0.1.5-r8';
const SHELL = ['/', '/demo', '/audit', '/privacy', '/terms', '/favicon.svg', '/manifest.webmanifest', '/art/verification-landscape-960.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Vite fingerprints its JS and CSS. Read the deployed document so this
    // worker precaches the exact version that installed it, rather than
    // guessing a filename or relying on a warm HTTP cache.
    const home = await fetch('/', { cache: 'no-cache' });
    const html = await home.text();
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?]+\.(?:js|css))(?:\?[^\"]*)?"/g)].map((match) => match[1]);
    await Promise.all([...new Set([...SHELL, ...assets])].map(async (path) => {
      const response = await fetch(path, { cache: 'reload' });
      if (!response.ok) throw new Error(`Could not precache ${path}`);
      await cache.put(path, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const path = new URL(event.request.url).pathname;
    const cached = await cache.match(path, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) void cache.put(event.request, response.clone());
      return response;
    } catch {
      return event.request.mode === 'navigate' ? (await cache.match('/')) ?? Response.error() : Response.error();
    }
  })());
});
