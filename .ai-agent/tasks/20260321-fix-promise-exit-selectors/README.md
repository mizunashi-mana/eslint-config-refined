# fix-promise-exit-selectors

## 目的・ゴール

`packages/eslint-plugin-promise/eslint.config.ts` で無効化されている3つの promise ルールを ESLint v10 で動作するよう修正し、有効化する。

## 問題の分析

ESLint v10 では `:exit` 疑似クラスはセレクタ文字列の**末尾**からのみ除去される（`source.replace(/:exit$/u, "")`）。そのため、カンマ区切りセレクタ内の中間位置にある `:exit` は未知の疑似クラスとしてエラーになる。

### 影響を受けるルール

- **`no-multiple-resolved`** — `'FunctionExpression:exit, ArrowFunctionExpression:exit'` が `Unknown class name: exit` でクラッシュ
  - 修正後に `'CallExpression, MemberExpression, NewExpression, ImportExpression, YieldExpression:exit'` も個別に分割（`:exit` が末尾の `YieldExpression` のみに適用される曖昧さを解消）
- **`always-return`** / **`no-nesting`** — 個別テストでは正常動作を確認。self-lint 無効化の解除のみ。

## 実装方針

1. `no-multiple-resolved.ts` のカンマ区切りセレクタを個別のキーに分割
2. `eslint.config.ts` から3ルールの無効化（`'off'` 設定）と TODO コメントを削除
3. テスト・lint の通過を確認

## 完了条件

- [x] `no-multiple-resolved` ルールが ESLint v10 でクラッシュしないこと
- [x] `npm test --workspace=packages/eslint-plugin-promise` が全て通ること
- [x] `npm run lint:eslint --workspace=packages/eslint-plugin-promise` が通ること
- [x] eslint.config.ts から3ルールの off 設定が削除されていること

## 作業ログ

- `no-multiple-resolved.ts` のカンマ区切りセレクタを個別キーに分割（enter/exit 両方）
- ハンドラ関数を `enterPromiseExecutor` / `exitPromiseExecutor` / `recordThrowableExpression` として抽出
- `eslint.config.ts` から3ルールの off 設定と TODO コメントを削除
- テスト 13 files / 22 tests 全パス、lint パス確認
