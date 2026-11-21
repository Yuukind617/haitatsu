// ============================================================
// 絵のデータ(すべて SVG という線と図形で描いた絵)
//   ・品物の絵(にんじん、たまご など 12しゅるい)
//   ・トラック、おうち
// 品物の絵は 100×100 のマスの中に描いています。
// ============================================================

// よく使う「ふちどり線」の書き方をまとめたもの
const S = 'stroke="#4a4a4a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';

// 絵の中身を <svg> タグで包んで、画面に置ける形にする
function svgWrap(inner, viewBox = '0 0 100 100') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

// ------------------------------------------------------------
// 数のよみかた(かぞえかた)
//   こ:いっこ にこ…  ほん:いっぽん にほん さんぼん…  ひき:いっぴき にひき さんびき…
// ------------------------------------------------------------
const COUNTER_READINGS = {
  'こ':   ['', 'いっこ', 'にこ', 'さんこ', 'よんこ', 'ごこ', 'ろっこ', 'ななこ', 'はっこ', 'きゅうこ'],
  'ほん': ['', 'いっぽん', 'にほん', 'さんぼん', 'よんほん', 'ごほん', 'ろっぽん', 'ななほん', 'はっぽん', 'きゅうほん'],
  'まい': ['', 'いちまい', 'にまい', 'さんまい', 'よんまい', 'ごまい', 'ろくまい', 'ななまい', 'はちまい', 'きゅうまい'],
  'ひき': ['', 'いっぴき', 'にひき', 'さんびき', 'よんひき', 'ごひき', 'ろっぴき', 'ななひき', 'はっぴき', 'きゅうひき'],
};

// 読み上げる文を作る(VOICEVOX の声もこの文で探す)
//   いまは数は いつも1つなので、品物の名前だけを読む。
//   (数をえらべるようにもどすときは、下の行を
//    return `${item.name} ${COUNTER_READINGS[item.counter][n]}`; にすると「にんじん にほん」のように読む)
function lineSpeech(item, n) {
  return item.name;
}

// ------------------------------------------------------------
// 品物の一覧
//   id      : config.js の items で使う名前
//   name    : 画面に出す名前(ひらがな)
//   counter : かぞえかた(こ / ほん / まい / ひき)
//   svg     : 絵
// ------------------------------------------------------------
const ITEMS = [
  { id: 'ninjin', name: 'にんじん', counter: 'ほん', svg: `
    <g transform="rotate(35 50 52)">
      <path d="M50 30 Q42 14 34 8 M50 30 Q50 12 50 3 M50 30 Q58 14 66 8" fill="none" stroke="#43a047" stroke-width="6" stroke-linecap="round"/>
      <path d="M37 32 Q50 24 63 32 Q59 62 51 94 Q50 97 49 94 Q41 62 37 32Z" fill="#fb8c00" ${S}/>
      <path d="M43 46 H49 M52 58 H57 M45 70 H50 M51 81 H54" stroke="#e65100" stroke-width="2.5" stroke-linecap="round"/>
    </g>` },

  { id: 'tamago', name: 'たまご', counter: 'こ', svg: `
    <path d="M50 10 Q80 12 80 58 Q80 92 50 92 Q20 92 20 58 Q20 12 50 10Z" fill="#fff3e0" ${S}/>
    <path d="M33 42 Q35 28 45 22" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>` },

  { id: 'gyunyu', name: 'ぎゅうにゅう', counter: 'ほん', svg: `
    <rect x="36" y="6" width="28" height="10" fill="#fff" ${S}/>
    <path d="M27 36 L36 16 H64 L73 36Z" fill="#e3f2fd" ${S}/>
    <rect x="27" y="36" width="46" height="58" fill="#fff"/>
    <rect x="27" y="56" width="46" height="20" fill="#42a5f5"/>
    <path d="M50 59 Q57 67 50 72 Q43 67 50 59Z" fill="#fff"/>
    <rect x="27" y="36" width="46" height="58" fill="none" ${S}/>` },

  { id: 'pan', name: 'しょくぱん', counter: 'まい', svg: `
    <path d="M14 48 Q8 20 32 18 Q41 9 50 15 Q59 9 68 18 Q92 20 86 48 V88 H14Z" fill="#c98d4a" ${S}/>
    <path d="M23 50 Q20 30 36 28 Q43 21 50 26 Q57 21 64 28 Q80 30 77 50 V81 H23Z" fill="#fff3d6"/>` },

  { id: 'ringo', name: 'りんご', counter: 'こ', svg: `
    <path d="M50 30 Q30 16 18 38 Q10 64 32 86 Q42 93 50 87 Q58 93 68 86 Q90 64 82 38 Q70 16 50 30Z" fill="#e53935" ${S}/>
    <path d="M50 30 Q50 18 56 10" fill="none" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>
    <path d="M56 18 Q70 6 80 18 Q68 28 56 18Z" fill="#43a047" ${S}/>
    <path d="M28 44 Q30 36 38 34" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>` },

  { id: 'banana', name: 'ばなな', counter: 'ほん', svg: `
    <path d="M16 24 Q14 66 52 82 Q76 90 90 74 Q62 70 44 50 Q34 38 30 20 Q22 16 16 24Z" fill="#fdd835" ${S}/>
    <path d="M24 26 Q26 60 60 78" fill="none" stroke="#f9a825" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M16 24 L18 14 L28 12 L30 20Z" fill="#8d6e63" ${S}/>
    <circle cx="88" cy="75" r="3" fill="#6d4c41"/>` },

  { id: 'tomato', name: 'とまと', counter: 'こ', svg: `
    <circle cx="50" cy="56" r="35" fill="#e53935" ${S}/>
    <path d="M50 14 V24" stroke="#2e7d32" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 22 L56 31 L68 27 L60 36 L70 43 L56 40 L50 49 L44 40 L30 43 L40 36 L32 27 L44 31Z" fill="#43a047" ${S}/>
    <path d="M26 54 Q27 44 34 40" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>` },

  { id: 'sakana', name: 'さかな', counter: 'ひき', svg: `
    <path d="M10 50 Q38 18 70 40 L92 24 Q87 50 92 76 L70 60 Q38 82 10 50Z" fill="#64b5f6" ${S}/>
    <path d="M20 56 Q40 70 66 58" fill="none" stroke="#bbdefb" stroke-width="4" stroke-linecap="round"/>
    <circle cx="26" cy="45" r="4.5" fill="#333"/>
    <path d="M40 36 Q47 50 40 64" fill="none" ${S}/>
    <path d="M52 44 Q55 47 52 50 M60 46 Q63 49 60 52 M52 54 Q55 57 52 60" fill="none" stroke="#1e88e5" stroke-width="2" stroke-linecap="round"/>` },

  { id: 'onigiri', name: 'おにぎり', counter: 'こ', svg: `
    <path d="M50 10 Q60 10 87 68 Q92 86 76 88 H24 Q8 86 13 68 Q40 10 50 10Z" fill="#fff" ${S}/>
    <path d="M33 60 H67 V88 H33Z" fill="#37474f" ${S}/>
    <path d="M38 66 H62" stroke="#546e7a" stroke-width="2"/>` },

  { id: 'kyabetsu', name: 'きゃべつ', counter: 'こ', svg: `
    <circle cx="50" cy="54" r="38" fill="#9ccc65" ${S}/>
    <path d="M18 66 Q20 32 50 18 Q80 32 82 66" fill="none" stroke="#7cb342" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 30 V88 M50 46 L36 38 M50 46 L64 38 M50 62 L32 54 M50 62 L68 54 M50 77 L38 71 M50 77 L62 71" stroke="#f1f8e9" stroke-width="2.6" stroke-linecap="round"/>` },

  { id: 'jusu', name: 'じゅーす', counter: 'ほん', svg: `
    <path d="M56 46 L66 8 H78" fill="none" stroke="#e53935" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27 30 H73 L66 92 H34Z" fill="#fff"/>
    <path d="M29.5 44 H70.5 L66 92 H34Z" fill="#fb8c00"/>
    <path d="M27 30 H73 L66 92 H34Z" fill="none" ${S}/>
    <circle cx="28" cy="32" r="11" fill="#ffb74d" ${S}/>
    <path d="M28 32 L28 22 M28 32 L37 27 M28 32 L37 37 M28 32 L19 37 M28 32 L19 27" stroke="#fff3e0" stroke-width="1.8"/>` },

  { id: 'aisu', name: 'あいす', counter: 'こ', svg: `
    <path d="M32 50 L50 95 L68 50Z" fill="#d7a35c" ${S}/>
    <path d="M38 56 L60 68 M35 60 L45 66 M44 76 L56 82 M62 56 L40 68 M65 60 L55 66 M56 76 L46 84" stroke="#a1662f" stroke-width="2" stroke-linecap="round"/>
    <circle cx="50" cy="40" r="21" fill="#f48fb1" ${S}/>
    <path d="M32 48 Q40 56 46 50 Q52 58 60 50 Q66 54 69 47" fill="none" ${S}/>
    <circle cx="50" cy="17" r="6" fill="#d32f2f" ${S}/>
    <path d="M50 11 Q52 4 58 3" fill="none" stroke="#6d4c41" stroke-width="2.5" stroke-linecap="round"/>` },

  { id: 'korokke', name: 'ころっけ', counter: 'こ', svg: `
    <ellipse cx="50" cy="56" rx="40" ry="27" fill="#c97a2b" ${S}/>
    <ellipse cx="50" cy="52" rx="33" ry="20" fill="#e09a45"/>
    <g fill="#f5c46b">
      <circle cx="32" cy="48" r="2.6"/><circle cx="42" cy="42" r="2.2"/><circle cx="55" cy="45" r="2.8"/><circle cx="67" cy="49" r="2.4"/>
      <circle cx="38" cy="58" r="2.4"/><circle cx="50" cy="55" r="2.2"/><circle cx="62" cy="59" r="2.6"/><circle cx="72" cy="56" r="2"/>
      <circle cx="28" cy="57" r="2"/><circle cx="46" cy="64" r="2"/>
    </g>
    <g fill="#9c5a1c">
      <circle cx="36" cy="44" r="1.6"/><circle cx="60" cy="41" r="1.6"/><circle cx="48" cy="49" r="1.4"/><circle cx="70" cy="62" r="1.6"/><circle cx="56" cy="64" r="1.4"/><circle cx="25" cy="52" r="1.4"/>
    </g>` },

  { id: 'poteto', name: 'ぽてと', counter: 'こ', svg: `
    <g fill="#fdd835" ${S}>
      <rect x="30" y="18" width="8" height="40" rx="2" transform="rotate(-10 34 38)"/>
      <rect x="40" y="10" width="8" height="46" rx="2" transform="rotate(-3 44 33)"/>
      <rect x="50" y="13" width="8" height="44" rx="2" transform="rotate(4 54 35)"/>
      <rect x="60" y="20" width="8" height="38" rx="2" transform="rotate(11 64 39)"/>
      <rect x="45" y="22" width="8" height="34" rx="2" transform="rotate(-18 49 39)"/>
      <rect x="55" y="24" width="8" height="32" rx="2" transform="rotate(20 59 40)"/>
    </g>
    <path d="M22 46 Q50 56 78 46 L70 93 H30Z" fill="#e53935" ${S}/>
    <path d="M27 62 Q50 70 73 62" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` },

  { id: 'roll', name: 'ぱん', counter: 'こ', svg: `
    <path d="M12 70 Q10 32 50 26 Q90 32 88 70 Q86 82 50 82 Q14 82 12 70Z" fill="#d68a35" ${S}/>
    <path d="M27 46 Q35 38 42 46 M45 38 Q53 31 60 39 M62 45 Q70 39 75 48" fill="none" stroke="#f3c47a" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M22 64 Q50 72 78 64" fill="none" stroke="#b86e22" stroke-width="2.5" stroke-linecap="round"/>` },

  { id: 'pizza', name: 'ぴざ', counter: 'まい', svg: `
    <circle cx="50" cy="50" r="43" fill="#d9963f" ${S}/>
    <circle cx="50" cy="50" r="35" fill="#fbc02d"/>
    <path d="M50 15 V85 M15 50 H85 M25.3 25.3 L74.7 74.7 M74.7 25.3 L25.3 74.7" stroke="#e0a63e" stroke-width="2"/>
    <g fill="#d84315"><circle cx="38" cy="31" r="6.5"/><circle cx="65" cy="35" r="6.5"/><circle cx="29" cy="58" r="6.5"/><circle cx="57" cy="62" r="6.5"/><circle cx="72" cy="57" r="5.5"/><circle cx="44" cy="73" r="5.5"/></g>
    <g fill="none" stroke="#43a047" stroke-width="2.5"><circle cx="49" cy="44" r="4.5"/><circle cx="38" cy="47" r="3.5"/><circle cx="64" cy="49" r="4"/></g>` },

  { id: 'hotcake', name: 'ほっとけーき', counter: 'まい', svg: `
    <ellipse cx="50" cy="84" rx="45" ry="9" fill="#fff" ${S}/>
    <path d="M14 66 V74 Q14 82 50 83 Q86 82 86 74 V66Z" fill="#c97a2b" ${S}/>
    <ellipse cx="50" cy="66" rx="36" ry="9" fill="#e9a958" ${S}/>
    <path d="M16 52 V60 Q16 68 50 69 Q84 68 84 60 V52Z" fill="#c97a2b" ${S}/>
    <ellipse cx="50" cy="52" rx="34" ry="9" fill="#f0b968" ${S}/>
    <ellipse cx="50" cy="52" rx="24" ry="5.5" fill="#a0581f" opacity=".55"/>
    <path d="M28 54 Q30 62 28 67 M70 54 Q72 60 70 64" fill="none" stroke="#a0581f" stroke-width="4" stroke-linecap="round" opacity=".8"/>
    <rect x="42" y="42" width="16" height="10" rx="2" fill="#fff59d" ${S}/>` },

  { id: 'kanzume', name: 'かんづめ', counter: 'こ', svg: `
    <path d="M22 22 V84 Q50 94 78 84 V22Z" fill="#cfd8dc" ${S}/>
    <path d="M22 36 V72 Q50 82 78 72 V36 Q50 46 22 36Z" fill="#e53935"/>
    <path d="M33 58 Q45 47 59 55 L67 49 Q65 58 67 67 L59 61 Q45 69 33 58Z" fill="#fff"/>
    <circle cx="39" cy="57" r="1.8" fill="#e53935"/>
    <path d="M22 22 V84 Q50 94 78 84 V22" fill="none" ${S}/>
    <ellipse cx="50" cy="22" rx="28" ry="7" fill="#eceff1" ${S}/>
    <ellipse cx="50" cy="22" rx="21" ry="4.5" fill="none" stroke="#b0bec5" stroke-width="2"/>
    <path d="M44 21 Q50 15 56 21" fill="none" stroke="#90a4ae" stroke-width="3" stroke-linecap="round"/>` },

  { id: 'makizushi', name: 'まきずし', counter: 'こ', svg: `
    ${[[29, 40], [71, 40], [50, 70]].map(([x, y]) => `
      <circle cx="${x}" cy="${y}" r="19" fill="#263238" ${S}/>
      <circle cx="${x}" cy="${y}" r="15" fill="#fff"/>
      <circle cx="${x - 4}" cy="${y - 3}" r="4.5" fill="#fdd835"/>
      <circle cx="${x + 4.5}" cy="${y - 1}" r="4" fill="#66bb6a"/>
      <circle cx="${x}" cy="${y + 5}" r="3.6" fill="#f06292"/>`).join('')}` },

  { id: 'chococake', name: 'ちょこけーき', counter: 'こ', svg: `
    <ellipse cx="50" cy="86" rx="45" ry="8" fill="#fff" ${S}/>
    <path d="M16 46 V78 Q50 90 84 78 V46Z" fill="#6d4c41" ${S}/>
    <path d="M16 62 Q50 73 84 62" fill="none" stroke="#fff3e0" stroke-width="4"/>
    <ellipse cx="50" cy="46" rx="34" ry="10" fill="#4e342e" ${S}/>
    <g fill="#fff3e0" stroke="#4a4a4a" stroke-width="1.5"><circle cx="27" cy="46" r="4.5"/><circle cx="39" cy="41" r="4.5"/><circle cx="61" cy="41" r="4.5"/><circle cx="73" cy="46" r="4.5"/></g>
    <path d="M50 24 Q39 26 42 37 Q46 45 50 46 Q54 45 58 37 Q61 26 50 24Z" fill="#e53935" ${S}/>
    <path d="M44 25 L50 19 L56 25" fill="#43a047" ${S}/>` },

  { id: 'yogurt', name: 'よーぐると', counter: 'こ', svg: `
    <path d="M24 30 H76 L68 90 H32Z" fill="#fff"/>
    <path d="M26.7 50 H73.3 L71.2 66 H28.8Z" fill="#90caf9"/>
    <circle cx="50" cy="58" r="5" fill="#f48fb1"/>
    <path d="M24 30 H76 L68 90 H32Z" fill="none" ${S}/>
    <path d="M73 27 L89 18 L91 27Z" fill="#e0e0e0" ${S}/>
    <ellipse cx="50" cy="30" rx="28" ry="6.5" fill="#e0e0e0" ${S}/>` },

  { id: 'negi', name: 'ねぎ', counter: 'ほん', svg: `
    <g transform="rotate(-35 50 52)">
      <path d="M44 92 L40 99 M50 93 V100 M56 92 L60 99" stroke="#9e9e9e" stroke-width="2" stroke-linecap="round"/>
      <path d="M44 54 Q40 30 33 5 Q43 8 48 32 Q49 9 57 3 Q60 28 56 54Z" fill="#7cb342" ${S}/>
      <rect x="43.5" y="48" width="13" height="12" fill="#c5e1a5"/>
      <rect x="43" y="56" width="14" height="37" rx="5" fill="#fafafa" ${S}/>
    </g>` },

  { id: 'shiitake', name: 'しいたけ', counter: 'こ', svg: `
    <path d="M42 54 Q39 80 44 91 H56 Q61 80 58 54Z" fill="#f5e6c8" ${S}/>
    <path d="M10 58 Q12 17 50 15 Q88 17 90 58 Q70 66 50 64 Q30 66 10 58Z" fill="#8d5524" ${S}/>
    <path d="M36 32 L45 41 M45 32 L36 41 M57 28 L64 36 M64 28 L57 36 M48 46 L55 53 M55 46 L48 53 M24 46 L29 51 M71 46 L76 51" stroke="#f3dcb5" stroke-width="3" stroke-linecap="round"/>` },

  { id: 'tamanegi', name: 'たまねぎ', counter: 'こ', svg: `
    <path d="M50 18 Q48 10 43 5 M50 18 Q54 8 59 5" fill="none" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
    <path d="M44 91 L41 98 M50 92 V99 M56 91 L59 98" stroke="#8d6e63" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 18 Q54 30 74 40 Q93 54 82 76 Q70 92 50 92 Q30 92 18 76 Q7 54 26 40 Q46 30 50 18Z" fill="#d9a05b" ${S}/>
    <path d="M50 22 Q34 50 39 90 M50 22 Q66 50 61 90 M50 22 V91" fill="none" stroke="#b9792f" stroke-width="2"/>
    <path d="M26 56 Q27 48 33 44" fill="none" stroke="#f3d29a" stroke-width="4" stroke-linecap="round"/>` },

  { id: 'donut', name: 'どーなつ', counter: 'こ', svg: `
    <path d="M12 52 A38 38 0 1 0 88 52 A38 38 0 1 0 12 52Z M38 52 A12 12 0 1 1 62 52 A12 12 0 1 1 38 52Z" fill="#d9a05b" fill-rule="evenodd" ${S}/>
    <path d="M18 50 Q14 66 26 76 Q38 88 54 85 Q72 84 80 70 Q88 56 82 42 Q76 26 60 21 Q44 16 30 26 Q18 34 18 50Z M36 52 A14 14 0 1 1 64 52 A14 14 0 1 1 36 52Z" fill="#f48fb1" fill-rule="evenodd"/>
    <circle cx="50" cy="52" r="12" fill="none" ${S}/>
    <g stroke-width="3.2" stroke-linecap="round">
      <path d="M30 40 L34 37" stroke="#fdd835"/><path d="M44 28 L48 30" stroke="#42a5f5"/><path d="M62 30 L65 34" stroke="#fff"/>
      <path d="M72 46 L75 50" stroke="#fdd835"/><path d="M70 66 L66 69" stroke="#42a5f5"/><path d="M52 76 L48 78" stroke="#66bb6a"/>
      <path d="M32 66 L28 63" stroke="#fff"/><path d="M26 54 L27 50" stroke="#66bb6a"/>
    </g>` },

  { id: 'hamburger', name: 'はんばーがー', counter: 'こ', svg: `
    <path d="M14 70 Q14 86 30 86 H70 Q86 86 86 70Z" fill="#e0a050" ${S}/>
    <path d="M12 58 Q22 52 30 60 Q40 52 50 60 Q60 52 70 60 Q80 52 88 58 L86 66 H14Z" fill="#7cb342" ${S}/>
    <rect x="12" y="60" width="76" height="12" rx="6" fill="#6d3d1d" ${S}/>
    <path d="M14 58 H86 L74 66 L68 60 L58 70 L50 60 L40 68 L32 60 L24 66Z" fill="#fdd835" ${S}/>
    <path d="M12 56 Q12 18 50 16 Q88 18 88 56Z" fill="#e8a24c" ${S}/>
    <g fill="#fff8e1"><ellipse cx="34" cy="34" rx="3" ry="1.8" transform="rotate(-20 34 34)"/><ellipse cx="50" cy="27" rx="3" ry="1.8"/>
      <ellipse cx="66" cy="34" rx="3" ry="1.8" transform="rotate(20 66 34)"/><ellipse cx="42" cy="44" rx="3" ry="1.8" transform="rotate(-10 42 44)"/>
      <ellipse cx="59" cy="45" rx="3" ry="1.8" transform="rotate(10 59 45)"/><ellipse cx="25" cy="47" rx="3" ry="1.8" transform="rotate(-30 25 47)"/><ellipse cx="75" cy="47" rx="3" ry="1.8" transform="rotate(30 75 47)"/></g>` },
];

// id から品物をさがす
const ITEM_BY_ID = Object.fromEntries(ITEMS.map(it => [it.id, it]));

// ------------------------------------------------------------
// トラック(200×120)。タイヤに class="wheel" を付けて、走っている間まわす
// ------------------------------------------------------------
function wheel(cx, cy, r) {
  return `<g class="wheel"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#333"/>` +
         `<circle cx="${cx}" cy="${cy}" r="${r * 0.45}" fill="#cfd8dc"/>` +
         `<path d="M${cx - r * 0.45} ${cy} H${cx + r * 0.45} M${cx} ${cy - r * 0.45} V${cy + r * 0.45}" stroke="#78909c" stroke-width="2"/></g>`;
}
const TRUCK_SVG = svgWrap(`
  <!-- にだい -->
  <rect x="8" y="18" width="112" height="72" rx="6" fill="#fff" ${S}/>
  <rect x="9.5" y="64" width="109" height="12" fill="#66bb6a"/>
  <text x="64" y="50" font-size="21" font-weight="700" text-anchor="middle" fill="#43a047" font-family="sans-serif">はいたつ</text>
  <!-- うんてんせき -->
  <path d="M122 38 H156 Q165 38 171 50 L186 66 Q190 70 190 77 V90 H122Z" fill="#66bb6a" ${S}/>
  <path d="M130 45 H155 L167 63 H130Z" fill="#e3f2fd" ${S}/>
  <rect x="182" y="77" width="8" height="6" rx="2" fill="#ffeb3b"/>
  <path d="M124 72 H138" stroke="#4a4a4a" stroke-width="2.5" stroke-linecap="round"/>
  <!-- タイヤ -->
  ${wheel(38, 92, 13)}${wheel(90, 92, 13)}${wheel(160, 92, 13)}
`, '0 0 200 112');

// おうち(160×140)
const HOUSE_SVG = svgWrap(`
  <rect x="104" y="14" width="16" height="30" fill="#8d6e63" ${S}/>
  <rect x="20" y="62" width="120" height="74" fill="#fff8e1" ${S}/>
  <path d="M6 66 L80 8 L154 66Z" fill="#e57373" ${S}/>
  <rect x="68" y="88" width="26" height="48" rx="3" fill="#a1663a" ${S}/>
  <circle cx="88" cy="114" r="2.5" fill="#ffd54f"/>
  <rect x="32" y="80" width="26" height="24" fill="#bbdefb" ${S}/>
  <path d="M45 80 V104 M32 92 H58" stroke="#4a4a4a" stroke-width="2"/>
  <rect x="104" y="80" width="26" height="24" fill="#bbdefb" ${S}/>
  <path d="M117 80 V104 M104 92 H130" stroke="#4a4a4a" stroke-width="2"/>
`, '0 0 160 140');

// スピーカー(よむ ボタン)
const SPEAKER_SVG = svgWrap(`<path d="M14 38 H32 L56 16 V84 L32 62 H14 Z" fill="#fff"/>
  <path d="M68 34 Q78 50 68 66 M78 24 Q96 50 78 76" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`);
