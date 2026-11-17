const CACHE_NAME = 'nubip-journals-2026-v9-cell-icon';
const FILES = ['./','./index.html','./styles.css','./app.js','./journals.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./ZakonText-Regular.otf','./ZakonText-Bold.otf'];
self.addEventListener('install', event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nubip-journals-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});}return response;}).catch(()=>caches.match(event.request)));
});
