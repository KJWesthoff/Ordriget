// Offline-cache. Hæv VERSION når filerne ændres, så telefonen henter de nye.
const VERSION = 'ordriget-v1';
const SHELL = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'js/main.js', 'js/scene.js', 'js/flow.js', 'js/gfx.js', 'js/fx.js', 'js/ui.js', 'js/quiz.js',
  'js/audio.js', 'js/state.js', 'js/learn.js',
  'js/data/words.js', 'js/data/game.js', 'js/data/story.js',
  'js/scenes/title.js', 'js/scenes/map.js', 'js/scenes/battle.js', 'js/scenes/puzzle.js',
  'js/scenes/village.js', 'js/scenes/menus.js',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Netværk først (så opdateringer slår igennem), cache som reserve når offline.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.host.includes('fonts.googleapis.com') || url.host.includes('fonts.gstatic.com');
  if (url.origin !== location.origin && !isFont) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
