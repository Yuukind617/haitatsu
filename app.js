// ============================================================
// はいたつごっこ  ―  画面を動かすプログラム
//
// 【流れ】
//   ① ちゅうもん  … 「きょうの おかいどく」(ランダムな品物が○%オフ)を読み上げる
//                    おうちの人が品物をタッチしてえらび(数は いつも1つ)、「ちゅうもんする」
//   ② レシート    … ちゅうもんしょ が上から出てくる。タッチすると読み上げ
//                    子どもが おもちゃを あつめて「あつめたよ!」
//   ③ トラック    … トラックが しゅっぱつ → おうちに とうちゃく
//                    おうちの人が「うけとりました」か「まちがってます」
//   ④ かんりょう  … 「はいたつ かんりょう しました!」
//      まちがい   … トラックが もどって、②のレシートにもどる
//
// このiPadの中だけで動きます(インターネットとは通信しません)。
// ============================================================

const STATE_KEY = 'haitatsu_state';   // とちゅうの ちゅうもんを覚えておく場所
const COUNT_KEY = 'haitatsu_count';   // きょう何回はいたつしたか

// ------------------------------------------------------------
// いまの状態
// ------------------------------------------------------------
let order = {};            // ちゅうもん中の品物 { 'ninjin': 1, 'tamago': 1, ... }(えらんだものが 1)
let orderNo = 1;           // ちゅうもん ばんごう
let receiptLines = [];     // レシートの行 [{ item, n, el }]
let page = 0;              // ちゅうもん画面の いまのページ(0から)
const PER_PAGE = 15;       // 1ページの品物の数(よこ5 × たて3)
let sale = null;           // きょうの おかいどく { id:品物, off:何%オフ }
let booting = true;        // アプリを開いている とちゅう(まだ画面をタッチしていない)
let saleAnnouncePending = false;   // まだ画面をタッチしていなくて、おかいどくを言えていない
let flow = 0;              // 画面の流れの番号(とちゅうで別の画面にしたら、古い動きを止めるため)

// よく使う小道具 ---------------------------------------------
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// 画面を切り替える(name: order / receipt / truck / done)
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + name).classList.add('active');
}

// 画面に出す品物(config.js の items の順番)
function shownItems() {
  const list = (CONFIG.items || []).map(id => ITEM_BY_ID[id]).filter(Boolean);
  return list.length ? list : ITEMS;
}

// ちゅうもんの中身を [{item, n}] の一覧にする(画面に出している順)
function orderList() {
  return shownItems().filter(it => order[it.id] > 0).map(it => ({ item: it, n: order[it.id] }));
}

// とちゅうの状態を保存する(アプリを開き直しても続きから)
function saveState(stage) {
  try { localStorage.setItem(STATE_KEY, JSON.stringify({ order, orderNo, stage, sale })); } catch (e) { }
}

// ============================================================
// おと(音のファイルは使わず、その場で作る)
// ============================================================
let audioCtx = null;
function tone(freq, start, dur, type = 'sine', vol = 0.25) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t0 = audioCtx.currentTime + start;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  } catch (e) { }
}
const sndTap    = () => tone(660, 0, .08);
const sndMinus  = () => tone(440, 0, .08);
const sndNo     = () => { tone(200, 0, .15, 'triangle'); };
const sndCheck  = () => { tone(784, 0, .1); tone(1047, .08, .15); };
// プリンターの「ジジジ…」
const sndPrint  = () => { for (let i = 0; i < 24; i++) tone(i % 2 ? 1800 : 1500, i * 0.1, .05, 'square', .04); };
// クラクション「プップー」
const sndHorn   = () => { tone(440, 0, .15, 'square', .12); tone(554, 0, .15, 'square', .08); tone(440, .25, .4, 'square', .12); tone(554, .25, .4, 'square', .08); };
// エンジン「ブロロロ…」
const sndEngine = (sec) => { for (let i = 0; i < sec * 8; i++) tone(70 + (i % 3) * 8, i * 0.125, .12, 'sawtooth', .05); };
// かんりょう「ピンポーン」+ ファンファーレ
const sndDone   = () => { tone(784, 0, .5); tone(622, .45, .8); [523, 659, 784, 1047].forEach((f, i) => tone(f, 1.4 + i * .14, .3)); tone(1047, 2.0, .6); };
// バックの「ピーピー」
const sndBack   = () => { for (let i = 0; i < 4; i++) tone(1000, i * 0.6, .3, 'square', .06); };
const sndWrong  = () => { tone(330, 0, .25, 'triangle'); tone(262, .25, .4, 'triangle'); };

// iPadは「画面を1回タッチしてから」でないと音を出せないので、最初のタッチで音の準備をする
document.addEventListener('pointerdown', () => {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) { }
});

// ============================================================
// ① ちゅうもん画面
// ============================================================
function buildOrderGrid() {
  const grid = $('item-grid');
  grid.innerHTML = '';
  shownItems().forEach(it => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = it.id;
    card.innerHTML = `<div class="pic">${svgWrap(it.svg)}</div><div class="name">${it.name}</div>` +
                     `<div class="badge">✓</div><div class="sale-tag"></div>`;
    // カードをタッチ → えらぶ / もう一度タッチ → やめる
    card.addEventListener('click', () => {
      if (order[it.id]) {
        delete order[it.id];
        sndMinus();
      } else {
        order[it.id] = 1;
        sndTap();
      }
      updateOrderView();
    });
    grid.appendChild(card);
  });
}

// ページの数
function pageCount() {
  return Math.max(1, Math.ceil(shownItems().length / PER_PAGE));
}

// ページを切りかえる(p:ページ番号 0から)
function setPage(p) {
  page = Math.min(Math.max(0, p), pageCount() - 1);
  updateOrderView();
}

// ページの切りかえボタンと、いまのページの品物だけを出す
function updatePager() {
  const pages = pageCount();
  $('pager').classList.toggle('hidden', pages <= 1);
  $('pg-prev').disabled = page === 0;
  $('pg-next').disabled = page === pages - 1;
  const ids = shownItems().map(it => it.id);
  // 品物カードは、いまのページのものだけ見せる
  document.querySelectorAll('.item-card').forEach(card => {
    const i = ids.indexOf(card.dataset.id);
    card.classList.toggle('off-page', Math.floor(i / PER_PAGE) !== page);
  });
  // ページの丸(1・2…)。えらんだ品物があるページには ✓ を出す
  let html = '';
  for (let p = 0; p < pages; p++) {
    const has = ids.slice(p * PER_PAGE, (p + 1) * PER_PAGE).some(id => order[id]);
    html += `<button class="pg-dot${p === page ? ' now' : ''}" data-p="${p}">${p + 1}${has ? '<span class="pg-check">✓</span>' : ''}</button>`;
  }
  $('pg-dots').innerHTML = html;
}

// カードの数と、下のまとめを今の状態に合わせる
function updateOrderView() {
  updatePager();
  document.querySelectorAll('.item-card').forEach(card => {
    card.classList.toggle('picked', !!order[card.dataset.id]);
    // おかいどくの品物には「○%オフ」の札をつける
    const isSale = !!sale && sale.id === card.dataset.id;
    card.classList.toggle('sale', isSale);
    card.querySelector('.sale-tag').textContent = isSale ? `${sale.off}%オフ` : '';
  });
  // 上の文字:おかいどくがあれば、それを出す(タッチすると、もう一度読む)
  const saleItem = sale && ITEM_BY_ID[sale.id];
  $('sale-info').innerHTML = saleItem
    ? `<span class="sale-mark">おかいどく</span>${saleItem.name} <b>${sale.off}%オフ</b>`
    : 'おうちの ひとが えらんでね';
  const list = orderList();
  $('order-summary').textContent = list.length ? `${list.length}こ えらんだよ` : 'えらんでね';
  $('btn-order').disabled = list.length === 0;
  $('btn-order').classList.toggle('bounce', list.length > 0);
  saveState('order');
}

// ============================================================
// きょうの おかいどく
//   あたらしい ちゅうもん画面になるたびに、品物を1つランダムにえらび、
//   10〜90%オフ(10%きざみ)にして読み上げる
// ============================================================
// おかいどくの品物と、何%オフかを決める
function pickSale() {
  const s = CONFIG.sale || {};
  if (s.enabled === false) { sale = null; return; }
  const items = shownItems();
  const min = Math.max(1, Math.round((s.min || 10) / 10)), max = Math.min(9, Math.round((s.max || 90) / 10));
  sale = { id: items[rand(0, items.length - 1)].id, off: rand(min, max) * 10 };
}

// 「きょうの おかいどくは、ころっけ! 30パーセント オフ! おかいどくだよ!」と読む
//   (3つに分けて読むと、VOICEVOX の声を品物の名前で使いまわせる)
function announceSale() {
  const item = sale && ITEM_BY_ID[sale.id];
  if (!item) return;
  saleAnnouncePending = false;
  const card = document.querySelector(`.item-card[data-id="${sale.id}"]`);
  say([{ text: 'きょうの おかいどくは、' }, { text: item.name, el: card }, { text: `${sale.off}パーセント オフ！ おかいどくだよ！` }]);
}

function showOrder() {
  flow++;
  hush();
  const isNew = !Object.keys(order).length;   // あたらしい ちゅうもんか
  if (isNew || !sale || !ITEM_BY_ID[sale.id]) {
    pickSale();
    // あたらしい ちゅうもんは、おかいどくの品物があるページから
    const i = shownItems().findIndex(it => sale && it.id === sale.id);
    page = i >= 0 ? Math.floor(i / PER_PAGE) : 0;
    showScreen('order');
    updateOrderView();
    // 開いた直後は声が出せないので、最初のタッチまで待つ(iPad の決まり)
    if (booting) saleAnnouncePending = true; else announceSale();
  } else {
    showScreen('order');
    updateOrderView();
  }
}

// 「おまかせ」:ランダムなちゅうもんを作る
function randomOrder() {
  const r = CONFIG.random_order || { kinds: [2, 4] };
  const items = shownItems();
  const kinds = Math.min(items.length, rand(r.kinds[0], r.kinds[1]));
  order = {};
  let picks = shuffle(items);
  // おかいどくの品物は、config.js の sale.random_rate の割合で必ず入れる(初期は 80%)
  const rate = (CONFIG.sale && CONFIG.sale.random_rate !== undefined) ? CONFIG.sale.random_rate : 0.8;
  if (sale && ITEM_BY_ID[sale.id] && Math.random() < rate) {
    picks = [ITEM_BY_ID[sale.id]].concat(picks.filter(it => it.id !== sale.id));
  }
  picks.slice(0, kinds).forEach(it => { order[it.id] = 1; });
  sndTap();
  updateOrderView();
}

// ============================================================
// ② レシート画面
// ============================================================
// animate:true のとき、プリンターから出てくる動きをする
async function showReceipt(animate) {
  const myFlow = ++flow;
  hush();
  const list = orderList();
  if (!list.length) { showOrder(); return; }
  saveState('receipt');

  const now = new Date();
  const box = $('receipt');
  box.innerHTML =
    `<div class="r-title">ちゅうもんしょ</div>` +
    `<div class="r-date">${now.getMonth() + 1}がつ ${now.getDate()}にち ・ ばんごう ${orderNo}</div>` +
    `<div class="r-sep"></div>`;
  receiptLines = list.map(({ item, n }) => {
    const line = document.createElement('div');
    line.className = 'r-line';
    line.innerHTML =
      `<div class="r-pic">${svgWrap(item.svg)}</div>` +
      `<div class="r-name">${item.name}${sale && sale.id === item.id ? `<span class="r-sale">${sale.off}%オフ</span>` : ''}</div>` +
      `<button class="r-check" aria-label="あつめた">✓</button>`;
    // 行をタッチ → その品物だけ読む
    line.addEventListener('click', () => say([{ text: lineSpeech(item, n), el: line }]));
    // ○をタッチ → ✓(あつめたしるし)をつける/はずす
    line.querySelector('.r-check').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      btn.classList.toggle('on');
      if (btn.classList.contains('on')) sndCheck(); else sndMinus();
      updateCollectedButton();
    });
    box.appendChild(line);
    return { item, n, el: line };
  });
  box.insertAdjacentHTML('beforeend',
    `<div class="r-sep"></div><div class="r-foot">いつも ありがとう ございます</div><div class="r-barcode"></div>`);
  // タイトルや下の部分をタッチ → ぜんぶ読む
  box.querySelectorAll('.r-title, .r-date, .r-foot, .r-barcode').forEach(el => el.addEventListener('click', readAll));

  updateCollectedButton();
  $('receipt-area').scrollTop = 0;
  showScreen('receipt');

  if (animate) {
    box.classList.remove('printing'); void box.offsetWidth; box.classList.add('printing');
    sndPrint();
    await sleep(2500);
    if (myFlow !== flow) return;
    await say('ちゅうもんが きたよ！');
    if (myFlow === flow) readAll();
  } else {
    // 開き直したときなどは、うごきも読み上げもなし(よむ ボタンで読める)
    box.classList.remove('printing');
  }
}

// ちゅうもんしょ を ぜんぶ読む(読んでいる行を光らせる)
function readAll() {
  const parts = [{ text: 'ちゅうもんしょを よむよ。' }];
  receiptLines.forEach(l => {
    parts.push({ text: lineSpeech(l.item, l.n), el: l.el });
  });
  parts.push({ text: 'いじょう です。' });
  say(parts);
}

// 読んでいる行が画面の外なら、見えるところまで動かす
new MutationObserver(list => {
  list.forEach(m => {
    if (m.target.classList && m.target.classList.contains('reading')) {
      m.target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

// ぜんぶ ✓ がついたら「あつめたよ!」を ぴょこぴょこさせる
function updateCollectedButton() {
  const checks = document.querySelectorAll('.r-check');
  const all = checks.length > 0 && [...checks].every(c => c.classList.contains('on'));
  $('btn-collected').classList.toggle('bounce', all);
}

// ============================================================
// ③ トラックの画面
// ============================================================
// トラックを x(vw)まで、ms ミリ秒かけて動かす
//   (もどるときは、向きはそのままで バックする。にだいの字が反対にならないように)
async function moveTruck(x, ms) {
  const truck = $('truck');
  truck.style.transition = ms ? `transform ${ms}ms ease-in-out` : 'none';
  truck.style.transform = `translateX(${x}vw)`;
  if (!ms) { void truck.offsetWidth; return; }
  truck.classList.add('moving');
  sndEngine(ms / 1000);
  await sleep(ms);
  truck.classList.remove('moving');
}

// 「あつめたよ!」→ トラックが しゅっぱつ → おうちに とうちゃく
async function departTruck() {
  const myFlow = ++flow;
  hush();
  saveState('truck');
  $('truck-buttons').classList.add('hidden');
  $('house').classList.add('hidden');
  $('truck-msg').textContent = 'しゅっぱつ！';
  await moveTruck(30, 0);
  showScreen('truck');

  sndHorn();
  await say('トラック、しゅっぱつ！');
  if (myFlow !== flow) return;
  await moveTruck(112, 2600);                   // みぎへ はしっていく
  if (myFlow !== flow) return;

  // おうちの まえに とうちゃく
  $('truck-msg').textContent = 'はいたつ ちゅう…';
  $('house').classList.remove('hidden');
  await moveTruck(-45, 0);
  await sleep(400);
  await moveTruck(24, 2600);
  if (myFlow !== flow) return;

  sndHorn();
  $('truck-msg').textContent = 'とどいたよ！';
  await say('とどいたよ！');
  if (myFlow !== flow) return;
  $('truck-buttons').classList.remove('hidden');
}

// 「まちがってます」→ トラックが もどって、レシートにもどる
async function wrongDelivery() {
  const myFlow = ++flow;
  $('truck-buttons').classList.add('hidden');
  $('truck-msg').textContent = 'まちがってるよ。もういちど あつめよう';
  sndWrong();
  await say('あれれ、まちがっているみたい。もういちど あつめてね');
  if (myFlow !== flow) return;
  sndBack();
  await moveTruck(-45, 2600);                   // バックで もどっていく
  if (myFlow !== flow) return;
  showReceipt(true);
}

// ============================================================
// ④ はいたつ かんりょう
// ============================================================
function deliveryDone() {
  flow++;
  hush();
  // きょう何回目か数える
  const today = new Date().toDateString();
  let c = { date: today, n: 0 };
  try { const saved = JSON.parse(localStorage.getItem(COUNT_KEY)); if (saved && saved.date === today) c = saved; } catch (e) { }
  c.n++;
  try { localStorage.setItem(COUNT_KEY, JSON.stringify(c)); } catch (e) { }
  $('done-count').textContent = `きょう ${c.n}かいめ の はいたつ`;

  // かみふぶき
  const colors = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#f48fb1'];
  $('confetti').innerHTML = Array.from({ length: 40 }, () =>
    `<span style="left:${rand(0, 100)}vw;background:${colors[rand(0, colors.length - 1)]};` +
    `animation-duration:${(rand(25, 50) / 10)}s;animation-delay:${(rand(0, 30) / 10)}s"></span>`).join('');

  showScreen('done');
  sndDone();
  const myFlow = flow;
  sleep(900).then(() => { if (myFlow === flow) say('はいたつ かんりょう！ ありがとう！'); });
  orderNo++;
  order = {};
  saveState('order');
}

// ============================================================
// ボタンに「押されたらすること」を結びつける
// ============================================================
$('btn-clear').addEventListener('click', () => { order = {}; sndMinus(); updateOrderView(); });
$('pg-prev').addEventListener('click', () => { sndTap(); setPage(page - 1); });
$('pg-next').addEventListener('click', () => { sndTap(); setPage(page + 1); });
$('pg-dots').addEventListener('click', e => {
  const dot = e.target.closest('.pg-dot');
  if (dot) { sndTap(); setPage(Number(dot.dataset.p)); }
});
// 品物の上を 左右にスワイプしても、ページを切りかえられる
let swipeX = null;
$('item-grid').addEventListener('touchstart', e => { swipeX = e.touches[0].clientX; }, { passive: true });
$('item-grid').addEventListener('touchend', e => {
  if (swipeX === null) return;
  const dx = e.changedTouches[0].clientX - swipeX;
  swipeX = null;
  if (Math.abs(dx) > window.innerWidth * 0.12) { sndTap(); setPage(page + (dx < 0 ? 1 : -1)); }
});
$('btn-random').addEventListener('click', randomOrder);
$('sale-info').addEventListener('click', () => { if (sale) announceSale(); });
// iPadは画面を1回タッチするまで声が出ないので、アプリを開いたときのおかいどくは、最初のタッチで言う
document.addEventListener('pointerup', () => {
  if (saleAnnouncePending && $('screen-order').classList.contains('active')) setTimeout(announceSale, 300);
  saleAnnouncePending = false;
});
$('btn-order').addEventListener('click', () => { if (orderList().length) showReceipt(true); });
$('btn-read').addEventListener('click', readAll);
$('btn-collected').addEventListener('click', () => { sndTap(); departTruck(); });
$('btn-back').addEventListener('click', () => { sndTap(); showOrder(); });
$('btn-received').addEventListener('click', deliveryDone);
$('btn-wrong').addEventListener('click', wrongDelivery);
$('btn-next').addEventListener('click', () => { sndTap(); showOrder(); });
document.addEventListener('contextmenu', e => e.preventDefault());

// オフラインでも開けるようにする仕組み(sw.js)を登録する(https のときだけ働く)
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

// ============================================================
// スタート
// ============================================================
$('title-truck').innerHTML = TRUCK_SVG;
$('done-truck').innerHTML = TRUCK_SVG;
$('truck').innerHTML = TRUCK_SVG;
$('house').innerHTML = HOUSE_SVG;
$('read-icon').innerHTML = SPEAKER_SVG;
buildOrderGrid();

// とちゅうの ちゅうもんが残っていれば、続きから(トラックのとちゅうだったら、レシートから)
try {
  const saved = JSON.parse(localStorage.getItem(STATE_KEY));
  if (saved) {
    order = saved.order || {};
    orderNo = saved.orderNo || 1;
    sale = saved.sale || null;
    // 品物の一覧にないもの(設定で消したもの)は外す
    Object.keys(order).forEach(id => { if (!ITEM_BY_ID[id] || !(order[id] > 0)) delete order[id]; else order[id] = 1; });
    if (saved.stage !== 'order' && orderList().length) showReceipt(false);
    else showOrder();
  } else {
    showOrder();
  }
} catch (e) {
  showOrder();
}

// ここまでで、アプリを開く準備はおしまい
booting = false;
