// 오프라인 사용을 위한 캐시. 앱을 수정해서 올릴 때 VERSION 숫자를 하나 올리면 새 버전이 바로 반영됩니다.
const VERSION = "v1";
const FILES = ["./", "./index.html", "./exam.html", "./manifest.webmanifest", "./icons/icon_192.png", "./icons/icon_512.png", "./icons/icon_180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
// 인터넷이 되면 최신 파일, 안 되면 저장해 둔 파일
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
