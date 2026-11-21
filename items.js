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
//   counter : かぞえかた(こ / ほん / ひき)
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

  { id: 'pan', name: 'ぱん', counter: 'こ', svg: `
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
