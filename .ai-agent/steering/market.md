# 市場分析

## 市場概要

JavaScript/TypeScript プロジェクト向けの ESLint 共有設定パッケージ市場。ESLint v10 のリリース（2026年2月）により、flat config が唯一の設定形式となり、多くの既存共有設定が更新を迫られている。

## ターゲットセグメント

- TypeScript を主要言語として使用する個人・チーム
- 厳格なコード品質管理を求める開発者
- 複数リポジトリで統一した lint ルールを適用したいメンテナ

## 競合分析

| パッケージ | 特徴 |
|---|---|
| eslint-config-love | 厳格・安全性重視。formatter 非統合。フレームワーク非依存 |
| @antfu/eslint-config | カスタマイズ性重視。Prettier 不使用、stylistic 統合。多数のフレームワーク対応 |
| eslint-config-airbnb | 広く普及した規約。ESLint v9/v10 対応が遅れている |
| typescript-eslint recommended configs | 公式推奨設定。最小限で、プロジェクト固有の拡張が必要 |

## 差別化ポイント

- **ESLint v10 ネイティブ対応**: v10 の新機能・新ルールを前提とした設計
- **厳格さとカスタマイズ性の両立**: デフォルトで常に有用なルールを有効化しつつ、トレードオフのあるルール（style 等）はカスタマイズ可能
- **カスタムプラグイン提供**: eslint-plugin-promise の v10 対応書き直しなど、既存プラグインの改良版を同梱
- **config 生成ユーティリティ**: `buildConfig()` 関数による型安全で宣言的な設定生成

## 市場動向

- ESLint v10 で eslintrc が完全廃止、flat config への移行が加速
- TypeScript の型情報を活用した高度な lint ルールへの需要増加
- eslint-plugin-promise 等の主要プラグインの v10 対応状況にばらつき
