# テストの整備

## 目的

eslint-config-refined の各サブ設定モジュールに対するテストを追加し、ルール設定の正当性を検証できるようにする。

## ゴール

各サブ設定（globals, js, ts, stylistic, imports, comments, node）が正しい ESLint 設定を生成することをテストで担保する。

## 実装方針

- 各サブ設定モジュールごとにテストファイルを作成
- テスト観点:
  - 設定が正しい構造を持つこと（plugins, rules, settings 等）
  - 期待するルールが含まれること
  - オプションによる挙動の変化（disableFixedRules, entrypointFiles 等）
  - ファイルパターン別の設定（テストファイル、.d.ts、.js 等への特別扱い）
- 既存の index.test.ts はより具体的なアサーションに強化

## 完了条件

- [ ] globals.config.ts のテスト追加
- [ ] js.config.ts のテスト追加
- [ ] ts.config.ts のテスト追加
- [ ] stylistic.config.ts のテスト追加
- [ ] imports.config.ts のテスト追加
- [ ] comments.config.ts のテスト追加
- [ ] node.config.ts のテスト追加
- [ ] index.ts のテスト強化
- [ ] 全テストが通ること

## 作業ログ

（作業開始）
