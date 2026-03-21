# 各パッケージに eslint-config-refined を適用

## 目的・ゴール

各パッケージ（`eslint-config-refined`, `eslint-plugin-promise`）の ESLint 設定を、自身が提供する `buildConfig()` に置き換え、dogfooding を実現する。

## 実装方針

### eslint-config-refined パッケージ

- `eslint.config.ts` で `./src/index.ts` から `buildConfig()` をインポートして使用
- ルールセット: `["common", "node"]`（デフォルト）
- `dist/**` の ignores を維持
- 必要に応じてルールの override を追加

### eslint-plugin-promise パッケージ

- `@mizunashi_mana/eslint-config-refined` を devDependencies に追加
- `eslint.config.ts` で `buildConfig()` をインポートして使用
- ルールセット: `["common", "node"]`（デフォルト）
- `dist/**` の ignores を維持
- 必要に応じてルールの override を追加

### 共通

- `npm run lint:eslint --workspaces` で lint エラーを確認し、コードを修正
- テストが通ることを確認

## 完了条件

- [x] eslint-config-refined の eslint.config.ts が buildConfig() を使用
- [x] eslint-plugin-promise の eslint.config.ts が buildConfig() を使用
- [x] `npm run lint:eslint --workspaces` がエラーなしで通る
- [x] `npm test --workspaces` がエラーなしで通る

## 作業ログ

### 2026-03-21

- eslint-config-refined: `eslint.config.ts` を `buildConfig()` ベースに変更
  - `./src/index.ts` から直接インポート
  - auto-fix で stylistic ルール違反を一括修正
  - `storybook.config.ts` と `tests/helpers.ts` の eslint-disable コメントに description を追加
  - テストファイルの `no-restricted-imports` をオーバーライドで無効化
- eslint-plugin-promise: `eslint.config.ts` を `buildConfig()` ベースに変更
  - `@mizunashi_mana/eslint-config-refined` を devDependencies に追加
  - auto-fix で stylistic ルール違反を一括修正
  - ESLint v10 互換性問題: `always-return`, `no-multiple-resolved`, `no-nesting` ルールが `:exit` 疑似クラスを使用しており ESLint v10 でクラッシュするため無効化（TODO）
  - ESLint プラグイン開発パターンとの衝突: `naming-convention`（AST ノード名）, `no-restricted-imports`（相対インポート）, `no-unsafe-type-assertion`（AST 型アサーション）を無効化
  - 既存コードパターンの修正が必要なルール群を一時的に無効化（TODO）
