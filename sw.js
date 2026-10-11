/* Budget Control Room offline cache — version 202610111147 */
var CACHE="bcr-202610111147";
var FILES=["app.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf("bcr-")===0&&k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  var r=e.request; if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  if(r.mode==="navigate"){
    var key=new URL(r.url);key.hash="";key.search="";
    e.respondWith(fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(key.href,cp);});}return res;}).catch(function(){return caches.match(key.href).then(function(hit){return hit||caches.match("app.html");});}));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){return hit||fetch(r);}));
});
