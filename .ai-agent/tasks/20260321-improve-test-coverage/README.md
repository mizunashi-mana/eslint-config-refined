# テストの整備

## 目的

eslint-config-refined の buildConfig が正しい ESLint 設定を生成することをスナップショットテストで担保する。

## ゴール

buildConfig の出力をスナップショットテストで検証し、ルール設定の意図しない変更を検出できるようにする。

## 実装方針

- 移植元リポジトリ（mcp-html-artifacts-preview）のテストパターンに倣い、スナップショットテストを採用
- extractSnapshotData ヘルパーで循環参照を除外しシリアライズ可能な形に変換
- テストパターン:
  - common ルールセットのみ
  - common + node ルールセット
  - common + node + disableFixedRules: true

## 完了条件

- [x] スナップショットテストの実装
- [x] 全テストが通ること
- [x] lint が通ること

## 作業ログ

- スナップショットテスト3パターンを実装、テスト・lint 通過を確認
