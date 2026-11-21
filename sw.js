// ============================================================
// オフラインでも開けるようにする仕組み(サービスワーカー)
//
// 【動き】
//   1. はじめて開いたとき、アプリのファイルを iPad の中に保存する
//   2. 次からは、保存してあるファイルをすぐ使う(電波がなくても開ける)
//   3. 電波があるときは、裏で新しい版を取りに行って保存しなおす
//      → 書きかえた場合、「2回目に開いたとき」から新しくなる
//
// ※ やることリストと同じ github.io に置くので、保存場所の名前は
//    「haitatsu-」で始まるものだけを使い、ほかのアプリの保存場所はさわらない
// ============================================================
const PREFIX = 'haitatsu-';
const CACHE = PREFIX + 'v5';
// 保存しておくファイルの一覧
const FILES = ['./', 'index.html', 'style.css', 'config.js', 'voice.js', 'items.js', 'app.js', 'icon.png', 'manifest.json'];

// はじめて読み込まれたとき:ファイルをまとめて保存する
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

// 新しい版に切り替わったとき:このアプリの古い保存場所だけを片づける
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// VOICEVOX の声のファイル(voices/voices_1.wav?v=作った日時)
//   大きいので毎回は取りなおさない。?v= が変わったときだけ取りに行き、古い版は消す
async function voiceFile(request) {
  const cache = await caches.open(CACHE);
  const saved = await cache.match(request);
  if (saved) return saved;
  const res = await fetch(request);
  if (res.ok) {
    const path = new URL(request.url).pathname;
    for (const old of await cache.keys()) {
      if (new URL(old.url).pathname === path) await cache.delete(old);
    }
    await cache.put(request, res.clone());
  }
  return res;
}

// ファイルが必要になったとき
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (/\/voices\/[^/]+\.wav$/.test(new URL(e.request.url).pathname)) {
    e.respondWith(voiceFile(e.request));
    return;
  }
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const saved = await cache.match(e.request, { ignoreSearch: true });
      // 裏で新しい版を取りに行く(取れたら保存しなおす)
      const fresh = fetch(e.request)
        .then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; })
        .catch(() => null);
      if (saved) { e.waitUntil(fresh); return saved; }
      return (await fresh) || new Response('オフラインです', { status: 503 });
    })
  );
});
