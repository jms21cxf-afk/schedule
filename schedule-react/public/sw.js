// PWA — 홈 화면 바로가기·오프라인 캐시 최소 등록
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 네트워크 우선 (API는 항상 서버)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
