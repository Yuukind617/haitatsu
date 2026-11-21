// ============================================================
// 設定ファイル
// 書きかえて GitHub にアップロードしたあと、iPadでアプリを2回開き直すと反映されます。
// ============================================================
const CONFIG = {
  // ちゅうもん画面に出す品物と、その順番(items.js の id)
  //   出したくない品物は、この一覧から消してください
  //   1ページに15こ(よこ5 × たて3)ずつ ならびます
  items: [
    // 1ページめ
    'ninjin', 'tamanegi', 'negi', 'shiitake', 'kyabetsu',
    'tomato', 'ringo', 'banana', 'tamago', 'gyunyu',
    'sakana', 'kanzume', 'pan', 'roll', 'onigiri',
    // 2ページめ
    'makizushi', 'korokke', 'poteto', 'pizza', 'hotcake',
    'hamburger', 'yogurt', 'jusu', 'aisu', 'chococake',
    'donut',
  ],

  // 「おまかせ」ボタンで作るちゅうもん
  //   kinds : 品物の数(いくつから いくつまで)
  random_order: { kinds: [2, 4] },

  // きょうの おかいどく(ちゅうもん画面になるたびに、ランダムな品物を○%オフにする)
  //   enabled     : false にすると、おかいどくなし
  //   min / max   : 何%オフにするか(10%きざみ。10〜90)
  //   random_rate : 「おまかせ」のとき、おかいどくの品物が入る割合(0.8 = 10回に8回)
  sale: { enabled: true, min: 10, max: 90, random_rate: 0.8 },

  // こえ(読み上げ)
  //   enabled : true で読み上げる / false で読み上げない
  //   rate    : はやさ(1がふつう。小さいほどゆっくり)
  //   pitch   : 声の高さ(1がふつう)
  voice: { enabled: true, rate: 0.9, pitch: 1.1 },
};
