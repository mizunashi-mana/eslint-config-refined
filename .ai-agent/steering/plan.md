# 実装計画

## 現在のフェーズ

新規開発 - 初期リリースに向けた基盤構築

## 完了済み

- プロジェクト基盤のセットアップ（モノレポ構成、ビルド、テスト、CI）

## 進行中

（なし）

## 今後の計画

### フェーズ 1: 基盤構築（@mizunashi_mana/eslint-config-refined）

- モノレポ基盤の構築（npm workspace、tsup、Vitest、ESLint self-hosting）
- 既存3リポジトリの eslint-config を統合・移植
  - globals / js / ts / stylistic / imports / comments / node の各サブ設定（promise は含めない）
  - `buildConfig()` ユーティリティ
- ESLint v10 対応の調整（v9 → v10 の破壊的変更への対応）
- テストの整備

### フェーズ 2: eslint-plugin-promise の v10 書き直し

- eslint-plugin-promise の既存ルールの調査・設計
- ESLint v10 の Rule API に準拠した再実装（@mizunashi_mana/eslint-plugin-promise）
- テストの整備
- eslint-config-refined に promise ルールセットを追加・統合

### フェーズ 3: React 対応 ✅

- React 対応ルールセットの追加（eslint-plugin-react-x）
- その他フレームワーク対応（必要に応じて）

### フェーズ 4: カスタマイズオプションの拡充

- トレードオフのあるルールのオプション化
- スタイル設定のカスタマイズ性向上
- ルールセット選択の柔軟性強化

### フェーズ 5: ルール拡充

- eslint-config-love のルール設定を参考にした網羅的なレビュー
- typescript-eslint / @eslint/js 等の各 recommended 設定との差分分析
- 不足ルールの追加・既存ルールの設定見直し

### フェーズ 6: npm 公開

- パッケージのバージョニング戦略の決定
- npm 公開パイプラインの構築（GitHub Actions）
- 既存リポジトリでの利用開始・移行
