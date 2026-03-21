# 技術アーキテクチャ

## 技術スタック

- **言語**: TypeScript 5.5+
- **ランタイム**: Node.js v24
- **対象 ESLint**: v10（ESLint v10.0.0+）
- **ビルド**: tsup（ESM 出力 + 型定義生成）
- **テスト**: Vitest
- **パッケージマネージャ**: npm workspace（モノレポ管理）
- **開発環境**: devenv（Nix ベース。Node.js、git-hooks 等を管理）
- **Lint 実行**: prek（pre-commit フック実行ツール。CI でも `prek run --all-files` で lint を実行）
- **CI lint**: actionlint（GitHub Actions ワークフローの静的解析。devenv の git-hooks で自動実行）

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
- **react.config.ts**: React 固有ルール（eslint-plugin-react-x）

### ルールセット

- **`common`**: js + ts + stylistic + imports + promise + comments（全環境共通）
- **`node`**: Node.js 固有ルール（サーバーサイド向け）
- **`react`**: React 固有ルール（eslint-plugin-react-x ベース）

## 主要依存ライブラリ

- `@eslint/js` - ESLint コアルール
- `typescript-eslint` - TypeScript 対応（パーサー + ルール）
- `@stylistic/eslint-plugin` - コードスタイルルール
- `eslint-plugin-import-x` - インポート整理
- `eslint-plugin-n` - Node.js ルール
- `eslint-plugin-unused-imports` - 未使用インポート検出
- `eslint-plugin-react-x` - React ルール（@eslint-react エコシステム、ESLint v10 対応）
- `@eslint-community/eslint-plugin-eslint-comments` - ESLint コメント管理
- `globals` - グローバル変数定義

## 移植元リポジトリ

以下の3リポジトリに同一内容の eslint-config パッケージがあり、eslint-config-refined の移植元となる:

- https://github.com/mizunashi-mana/cc-voice-reporter/tree/main/packages/eslint-config
- https://github.com/mizunashi-mana/mcp-html-artifacts-preview/tree/main/packages/eslint-config
- https://github.com/mizunashi-mana/example-todo-app-with-agent-sdk/tree/main/packages/eslint-config

## 開発環境

devenv による Nix ベースの開発環境を使用。`devenv shell` で Node.js や開発ツールが利用可能になる。

```bash
# セットアップ
npm install

# ビルド
npm run build --workspaces

# テスト
npm test --workspaces

# lint（prek 経由で全ファイル対象）
prek run --all-files

# 個別パッケージの eslint
npm run lint:eslint --workspaces

# 型チェック
npm run typecheck --workspaces
```

## テスト戦略

- **Vitest** でルール設定の正当性を検証
- 各パッケージに独立したテストスイート

## CI/CD

- GitHub Actions による CI（ワークフロー分離）
  - **ci-lint**: devenv + prek による build・typecheck・lint（composite action でセットアップ共通化）
  - **ci-test**: Node.js + npm による build・test
- composite actions（`.github/actions/`）でセットアップ手順を共通化
- npm への公開パイプライン（予定）
