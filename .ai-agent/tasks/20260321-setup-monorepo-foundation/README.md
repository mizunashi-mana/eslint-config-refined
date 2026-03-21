# モノレポ基盤の構築

## 目的・ゴール

npm workspace ベースのモノレポ基盤を構築し、パッケージの開発・ビルド・テスト・lint が一通り動作する状態にする。

## 実装方針

1. ルートに `package.json` を作成し、npm workspace を設定（`packages/*`）
2. `packages/eslint-config-refined/` にメインパッケージの雛形を作成
   - `package.json`（`@mizunashi_mana/eslint-config-refined`）
   - tsup でビルド（ESM + 型定義）
   - Vitest でテスト
   - `src/index.ts` にエントリポイントの雛形
3. ルートレベルのツール設定
   - TypeScript（`tsconfig.json`）
   - ESLint self-hosting（`eslint.config.ts`）
   - `.gitignore` の整備
4. GitHub Actions で CI を設定（lint、typecheck、test、build）

## 完了条件

- [x] npm workspace が正しく構成されている
- [x] `packages/eslint-config-refined` の `package.json` が適切に設定されている
- [x] tsup でビルドが通る（`npm run build --workspaces`）
- [x] Vitest でテストが通る（`npm test --workspaces`）
- [x] ESLint で self-hosting lint が通る（`npm run lint:eslint --workspaces`）
- [x] TypeScript の型チェックが通る（`npm run typecheck --workspaces`）
- [x] GitHub Actions CI が設定されている

## 作業ログ

- 2026-03-21: モノレポ基盤を構築
  - ルート `package.json`（npm workspaces）、`tsconfig.base.json` を作成
  - `packages/eslint-config-refined/` にパッケージ雛形を作成（tsup, vitest, eslint self-hosting）
  - tsconfig を build 用（`tsconfig.build.json`）と lint/IDE 用（`tsconfig.json`、`exclude` のみ）に分離
  - ESLint config で `allowDefaultProject` が不要になるよう設計
  - GitHub Actions CI（`.github/workflows/ci.yml`）を作成
  - build / test / typecheck / lint すべて通ることを確認
