# 技術アーキテクチャ

## 技術スタック

- **言語**: TypeScript 5.5+
- **対象 ESLint**: v10（ESLint v10.0.0+）
- **ビルド**: tsup（ESM 出力 + 型定義生成）
- **テスト**: Vitest
- **パッケージマネージャ**: npm workspace（モノレポ管理）

## アーキテクチャ概要

モノレポ構成で、複数の npm パッケージを `packages/` 配下に配置する。

### パッケージ構成

| パッケージ | npm パッケージ名 | 役割 |
|---|---|---|
| `packages/eslint-config-refined` | `@mizunashi_mana/eslint-config-refined` | メインの共有設定。config 生成ユーティリティと各種ルール設定を提供 |
| `packages/eslint-plugin-promise` | `@mizunashi_mana/eslint-plugin-promise` | eslint-plugin-promise の ESLint v10 用書き直し |

### eslint-config-refined の内部構成

エントリポイント `src/index.ts` から `buildConfig(env)` 関数をエクスポートし、以下のモジュラーなサブ設定を組み合わせる:

- **globals.config.ts**: グローバル変数定義、パーサーオプション（projectService）
- **js.config.ts**: ESLint コアルール（eslint:recommended ベース + 厳格な追加ルール）
- **ts.config.ts**: typescript-eslint ルール（recommendedTypeChecked ベース + 厳格な追加ルール）
- **stylistic.config.ts**: @stylistic/eslint-plugin によるコードスタイルルール
- **imports.config.ts**: eslint-plugin-import-x によるインポート整理ルール
- **promise.config.ts**: Promise 関連ルール
- **comments.config.ts**: ESLint コメントディレクティブのルール
- **node.config.ts**: Node.js 固有ルール

### ルールセット

- **`common`**: js + ts + stylistic + imports + promise + comments（全環境共通）
- **`node`**: Node.js 固有ルール（サーバーサイド向け）
- 今後 `react` 等のフレームワーク固有ルールセットを追加予定

## 主要依存ライブラリ

- `@eslint/js` - ESLint コアルール
- `typescript-eslint` - TypeScript 対応（パーサー + ルール）
- `@stylistic/eslint-plugin` - コードスタイルルール
- `eslint-plugin-import-x` - インポート整理
- `eslint-plugin-n` - Node.js ルール
- `eslint-plugin-unused-imports` - 未使用インポート検出
- `@eslint-community/eslint-plugin-eslint-comments` - ESLint コメント管理
- `globals` - グローバル変数定義

## 開発環境

```bash
# セットアップ
npm install

# ビルド
npm run build --workspaces

# テスト
npm test --workspaces

# lint
npm run lint:eslint --workspaces

# 型チェック
npm run typecheck --workspaces
```

## テスト戦略

- **Vitest** でルール設定の正当性を検証
- 各パッケージに独立したテストスイート

## CI/CD

- GitHub Actions による自動テスト・lint・型チェック
- npm への公開パイプライン（予定）
