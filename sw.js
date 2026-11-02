/* Skizzenbrett: keeps the start page and the encrypted app on the device so it starts without internet. */
const V='skz-20261102092313',CORE=['./','index.html','app.enc','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  /* start page and app: newest from the net when online, otherwise the stored copy */
  if(r.mode==='navigate'||u.pathname.endsWith('/app.enc')){const key=r.mode==='navigate'?'index.html':'app.enc';
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(key,c))}return res}).catch(()=>caches.match(key)));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})))});
