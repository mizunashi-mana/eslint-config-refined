# React 対応ルールセットの追加

## 目的・ゴール

eslint-config-refined に React 対応ルールセットを追加し、React プロジェクトでも利用可能にする。

## 実装方針

### 1. React 用 ESLint プラグインの導入

- `eslint-plugin-react-x` - React 固有のルール + Hooks ルール（@eslint-react エコシステム、ESLint v10 対応）
  - 注: `eslint-plugin-react` / `eslint-plugin-react-hooks` は ESLint v10 未対応のため不採用

### 2. react.config.ts の作成

既存パターン（`buildXyzConfig()` → `defineConfig([...])` ）に準拠:

- `eslint-plugin-react-x` の `recommended-typescript` 設定をベースに
- recommended で warn のルールを error に引き上げ

### 3. RuleSet の拡張

- `RuleSet` 型に `"react"` を追加
- `buildConfig()` の switch に `case "react"` を追加

### 4. テストの追加

- `index.test.ts` に `common + react` ルールセットのスナップショットテストを追加

### 5. その他の変更（PR に含める）

- devenv.nix: eslint-plugin-promise 用の git-hooks 追加
- .claude/settings.json: Skill パーミッション追加
- steering ドキュメントの更新（plan.md, tech.md, structure.md）

## 完了条件

- [x] `eslint-plugin-react-x` が dependencies に追加されている
- [x] `src/react.config.ts` が作成されている
- [x] `RuleSet` 型に `"react"` が追加されている
- [x] `buildConfig()` で `"react"` ルールセットが選択可能
- [x] スナップショットテストが追加・パスしている
- [x] `npm run lint:eslint --workspaces` がパスする
- [x] `npm run typecheck --workspaces` がパスする
- [x] steering ドキュメントが更新されている

## 作業ログ

- 2026-03-21: eslint-plugin-react-x を使って React ルールセットを実装完了

