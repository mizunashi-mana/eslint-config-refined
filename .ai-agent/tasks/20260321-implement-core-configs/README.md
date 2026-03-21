# implement-core-configs

## 目的・ゴール

`buildConfig()` に globals / js / ts の3つのコア設定を実装し、実際に ESLint 設定として機能する状態にする。

## 実装方針

- `src/` ディレクトリに各サブ設定を配置（既存リポジトリの構成を踏襲）
  - `globals.config.ts`: グローバル変数定義、パーサーオプション（projectService）
  - `js.config.ts`: ESLint コアルール（eslint:recommended ベース + 厳格な追加ルール）
  - `ts.config.ts`: typescript-eslint ルール（recommendedTypeChecked ベース + 厳格な追加ルール）
- `buildConfig(env)` でこれらを組み合わせて返す
- テストを追加
- 依存パッケージの整理（dependencies / peerDependencies / devDependencies）

## 完了条件

- [x] globals.config.ts が実装されている
- [x] js.config.ts が実装されている
- [x] ts.config.ts が実装されている
- [x] buildConfig() が3つの設定を組み合わせて返す
- [x] テストが通る
- [x] lint が通る
- [x] ビルドが通る

## 作業ログ

- 既存3リポジトリ（cc-voice-reporter, mcp-html-artifacts-preview, example-todo-app-with-agent-sdk）から設定を移植
- package.json を整理: @eslint/js, globals, typescript-eslint を dependencies に、eslint, typescript を peerDependencies に
- globals.config.ts, js.config.ts, ts.config.ts を作成
- index.ts を更新: BuildConfigEnv に ruleSets, entrypointFiles を追加、defineConfig を使用
- node ルールセットは TODO として後続タスクに委ねる
- テスト5件追加、全パス
- 移植元リポジトリの参照を tech.md に記載
