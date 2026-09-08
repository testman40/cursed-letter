# 『呪いの便箋』公開版変更履歴

このファイルを、ゲーム公開版のバージョン履歴の正本とする。

ここで扱う公開版番号は、`SAVE_FORMAT_VERSION`、`GAME_DATA_VERSION`、仕様書・設定資料・ストーリー概要の各版番号とは別に管理する。

## Ver1.0.1

- 公開日：未公開
- 公開先：GitHub Pages（上巻）、ChatGPT Sites（下巻）

### ユーザー向け更新内容

- セーブデータ読み込み後に進行が上書きされることがある問題を修正
- END演出中の表示不具合を修正
- 第五章のScene切替演出を修正
- 1988年事件に関する人物関係の記述を修正
- 演出仕様と設定資料の整合性を改善

### 内部管理情報

- H1：ロード開始時に旧END演出タイマーとエンド演出状態を解除
- H2：1988年事件の女性の続柄を「山添の姪」へ統一
- M1：暗転中のEND見出し非表示指定を`#end-title`へ整合
- M2：第五章CSVへ`direction`を7件追加
- 第五章CSV：150レコードから157レコードへ更新
- 全9章CSV：1,524レコードから1,531レコードへ更新
- Scene数：66を維持
- 独立したScene切替をCSVの`direction`として扱う運用ルールを追加
- 秒数指定は原則として演出目安として扱う運用ルールを追加
- BGM部分音量指定は現時点では制作メモとして扱う運用ルールを追加
- 1988年事件の姪を「山添の年上の姉の娘」とする家系設定を補足
- `SAVE_FORMAT_VERSION`：変更なし
- 章・ルート・Ending：追加なし

### 公開対応情報

#### GitHub Pages（上巻）

- 公開commit：未確定

#### ChatGPT Sites（下巻）

- Sites Version：未確定
- Sites保存版ID：未確定
- 対応commit：未確定

## Ver1.0.0

- 説明：初回公開版

### GitHub Pages（上巻）

- 公開名称：呪いの便箋 ～上巻・告白の序章～
- 公開日：2026年8月28日
- 公開URL：https://testman40.github.io/cursed-letter/
- 対応commit：`dc2f1cf756035a5039a05d615f7d6a039460bcdb`

### ChatGPT Sites（下巻）

- 公開名称：呪いの便箋 ～下巻・最後の一筆～
- 公開日：2026年9月2日
- 公開URL：https://cursed-letter-lower-final-stroke.tanaka3sai.chatgpt.site/
- Sites Version：3
- Sites保存版ID：`appgver_63119e8be5ac819189c0a45b928c54e2`
- 対応commit：`2956fa65e134afe81f3a04501df7071e322a9f19`
- package：`1.0.0`

## 採番ルール

- PATCH（例：`1.0.0`から`1.0.1`）：バグ修正、軽微な演出修正、設定整合性修正
- MINOR（例：`1.0.x`から`1.1.0`）：機能、シナリオ、遊び方などの実質的追加
- MAJOR（例：`1.x.x`から`2.0.0`）：互換性を壊す大規模変更、大幅な再設計
