# プロダクトビジョン

## ミッション

JavaScript/TypeScript プロジェクトにおいて、高品質なコードを低コストで維持できる ESLint 設定とツール群を提供する。

## ターゲットユーザー

- TypeScript で開発する個人開発者・チーム
- 複数リポジトリにまたがる ESLint 設定の重複管理に課題を持つメンテナ
- eslint-config-love のような厳格な設定を求めつつ、ESLint v10 対応やカスタマイズ性も必要とするユーザー

## ユースケース

- **統一設定の導入**: `buildConfig()` を呼ぶだけで、厳格かつ実用的な ESLint 設定を即座に適用
- **ルールセットの選択**: `common`（JS/TS/stylistic/imports/promise/comments）、`node` などのルールセットを組み合わせて環境に合わせた設定を構築
- **段階的なカスタマイズ**: トレードオフのあるルールやスタイル設定をオプションで調整
- **フレームワーク対応**: React 等のフレームワーク固有ルールをルールセットとして追加可能

## 主要機能

### 提供中 / 初期リリース予定

- **@mizunashi_mana/eslint-config-refined**: ESLint v10 対応の共有設定パッケージ
  - `buildConfig()` による型安全な設定生成ユーティリティ
  - モジュラーなルール構成（js, ts, stylistic, imports, node, promise, comments）
  - ルールセットによる環境別の構成（common, node, react, playwright, storybook）
- **@mizunashi_mana/eslint-plugin-promise**: eslint-plugin-promise の ESLint v10 用書き直し（12ルール実装済み）

### 今後提供予定

- その他のカスタムルールパッケージ

## 差別化ポイント

- **厳格さ重視**: デフォルトで常に有用なルールを有効化し、安全でないコードパターンを早期に検出
- **ESLint v10 ファースト**: レガシーの互換性レイヤーを持たず、v10 の機能をフルに活用
- **@stylistic 統合**: Prettier を使わず、ESLint 単体でコードスタイルも管理
- **カスタムプラグイン同梱**: 既存プラグインの v10 対応が遅れている問題を自前で解決
