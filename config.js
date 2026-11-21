// ============================================================
// 設定ファイル
// 書きかえて GitHub にアップロードしたあと、iPadでアプリを2回開き直すと反映されます。
// ============================================================
const CONFIG = {
  // ちゅうもん画面に出す品物と、その順番(items.js の id)
  //   出したくない品物は、この一覧から消してください
  items: ['ninjin', 'tamago', 'gyunyu', 'pan', 'ringo', 'banana', 'tomato',
          'sakana', 'onigiri', 'kyabetsu', 'jusu', 'aisu', 'korokke', 'poteto'],

  // 「おまかせ」ボタンで作るちゅうもん
  //   kinds : 品物の数(いくつから いくつまで)
  random_order: { kinds: [2, 4] },

  // こえ(読み上げ)
  //   enabled : true で読み上げる / false で読み上げない
  //   rate    : はやさ(1がふつう。小さいほどゆっくり)
  //   pitch   : 声の高さ(1がふつう)
  voice: { enabled: true, rate: 0.9, pitch: 1.1 },
};
