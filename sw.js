// 오프라인 저장: 앱 화면은 열 때마다 최신으로, 못 받으면 저장본으로. 사진은 한 번 받아 두고 계속 씀
importScripts('data.js');
var CORE = 'swiss-route-v6', IMGC = 'swiss-route-img';
var FILES = ['./', 'index.html', 'data.js', 'check.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
var MAP = {}; // 'img/키.jpg' 전체 주소 → 원본 주소
Object.keys(self.ROUTE.IMG).forEach(function (k) {
  var I = self.ROUTE.IMG[k];
  MAP[new URL(I.local, self.registration.scope).href] = I.src;
});

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CORE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CORE && k !== IMGC; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }).then(function () { fillImages(); }));
});

function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function getImage(localUrl, tries) {
  return caches.open(IMGC).then(function (c) {
    return c.match(localUrl).then(function (hit) {
      if (hit) return hit;
      return fetch(localUrl).then(function (res) {
        if (res.ok) return res;
        throw 0;
      }).catch(function () {
        return fetch(MAP[localUrl], { mode: 'cors' }).then(function (res) {
          if (res.status === 429 && (tries || 0) < 3) return wait(4000 * ((tries || 0) + 1)).then(function () { return getImage(localUrl, (tries || 0) + 1); });
          if (!res.ok) throw 0;
          return res;
        });
      }).then(function (res) { c.put(localUrl, res.clone()); return res; });
    });
  });
}
function fillImages() {
  var urls = Object.keys(MAP), i = 0;
  function next() {
    if (i >= urls.length) {
      return self.clients.matchAll().then(function (cs) { cs.forEach(function (c) { c.postMessage({ done: true }); }); });
    }
    var u = urls[i++];
    return getImage(u).catch(function () {}).then(function () { return wait(600); }).then(next);
  }
  return next();
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (MAP[url.href]) { e.respondWith(getImage(url.href).catch(function () { return Response.error(); })); return; }
  var same = url.origin === location.origin;
  var font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!same && !font) return;
  e.respondWith(caches.open(CORE).then(function (c) {
    var key = req.mode === 'navigate' ? 'index.html' : req;
    return fetch(req).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) c.put(key, res.clone());
      return res;
    }).catch(function () { return c.match(key, { ignoreSearch: true }); });
  }));
});
