# ルール拡充

## 目的・ゴール

フェーズ 5「ルール拡充」として、eslint-config-love / eslint-config-standard / typescript-eslint プリセットとのギャップ分析に基づき、不足ルールの追加および既存ルールの設定見直しを行う。

## 関連調査

- `.ai-agent/surveys/20260321-rule-expansion-gap-analysis/README.md`

## 実装方針

1. 採否を対話的に決定
2. 決定したルールを各 config ファイルに追加・変更
3. スナップショットテストを更新
4. build / test / lint の確認

## 完了条件

- [x] 採用ルールの決定
- [x] ルールの追加・設定変更の実装
- [x] テストの更新・パス
- [x] build / typecheck / lint パス

## 作業ログ

### 採否決定

**採用（新規追加）:**
- `no-useless-assignment` (js.config.ts)
- `preserve-caught-error` with `requireCatchParameter: true` (js.config.ts)
- `prefer-named-capture-group` (js.config.ts)
- `require-unicode-regexp` with `requireFlag: 'v'` (js.config.ts)
- `@typescript-eslint/strict-void-return` with `allowReturnAny: false` (ts.config.ts)
- `n/prefer-node-protocol` (node.config.ts) — import-x に該当ルールがなかったため n プラグインで代替

**設定値変更:**
- `no-param-reassign`: `'error'` → `['error', { props: true }]`
- `@typescript-eslint/require-array-sort-compare`: `'error'` → `['error', { ignoreStringArrays: true }]`

**不採用:**
- `no-await-in-loop`, `explicit-function-return-type`, `no-unnecessary-type-parameters`, `arrow-body-style`, `no-negated-condition`, `no-undef-init`, `class-methods-use-this`, `prefer-destructuring`, `require-await`

### 実装完了

- 各 config ファイルにルール追加・変更を実施
- スナップショットテスト更新
- build / test / typecheck / lint 全てパス
