# picstash との差分から有用なルールを取り込む

## 目的・ゴール

picstash の eslint-config との差分調査（`.ai-agent/surveys/20260321-picstash-rule-diff/`）で特定された変更を反映する。

## 実装方針

### 1. node.config.ts に2ルール追加

- `n/no-callback-literal`: error → **既に存在していた（対応不要）**
- `n/no-exports-assign`: error → **既に存在していた（対応不要）**

### 2. ts.config.ts のテストオーバーライド拡充

テストファイル（`*.{test,spec,stories}.{ts,tsx}`）で以下を off に追加:
- `@typescript-eslint/no-unsafe-call`
- `@typescript-eslint/no-unsafe-member-access`

（`no-unsafe-assignment`, `no-unsafe-argument`, `no-unsafe-return` は既に存在していた）

### 3. ts.config.ts の naming-convention に variable PascalCase 追加

variable セレクタの format に `PascalCase` を追加（React コンポーネント変数代入対応）。

## 完了条件

- [x] `n/no-callback-literal` と `n/no-exports-assign` が node.config.ts に存在（既存）
- [x] テストファイルで `no-unsafe-*` ルールが包括的に off になっている
- [x] naming-convention の variable に PascalCase が追加されている
- [x] `npm run lint:eslint --workspaces` が通る
- [x] `npm test --workspaces` が通る

## 作業ログ

- 2026-03-21: 調査の結果、node.config.ts の2ルールは既に取り込み済みと判明。ts.config.ts に対して2件の変更を実施（テスト no-unsafe-* 拡充 + naming-convention PascalCase 追加）。スナップショット更新済み。
