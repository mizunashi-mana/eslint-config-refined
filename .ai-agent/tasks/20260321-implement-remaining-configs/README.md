# stylistic / imports / comments / node 設定の実装

## 目的・ゴール

フェーズ1の残りサブ設定（stylistic, imports, comments, node）を移植元から移植し、`buildConfig()` に統合する。

## 実装方針

移植元リポジトリ（cc-voice-reporter）の各設定ファイルをベースに、eslint-config-refined のコード規約（ダブルクォート等）に合わせて移植する。

1. 必要な依存パッケージを追加
2. 各サブ設定ファイルを作成
3. `index.ts` の `buildConfig()` に統合
4. テストを追加
5. ビルド・テスト・lint を通す

## 完了条件

- [x] `stylistic.config.ts` を実装
- [x] `imports.config.ts` を実装
- [x] `comments.config.ts` を実装
- [x] `node.config.ts` を実装
- [x] `index.ts` に全設定を統合
- [x] テストが通る
- [x] ビルド・typecheck が通る
- [x] lint が通る

## 作業ログ

- 依存パッケージ追加: `@stylistic/eslint-plugin`, `eslint-plugin-import-x`, `eslint-plugin-unused-imports`, `@eslint-community/eslint-plugin-eslint-comments`, `eslint-plugin-n`, `eslint-import-resolver-typescript`, `@types/node`
- 4つのサブ設定ファイルを移植元から移植（ダブルクォートに統一）
- `index.ts` を更新: common に stylistic/imports/comments、node ルールセットに node を統合。`disableFixedRules` オプションを追加
- imports.config.ts の不要な `@ts-expect-error` を削除（現バージョンでは型互換性の問題なし）
- ビルド・テスト・typecheck・lint 全て通過
