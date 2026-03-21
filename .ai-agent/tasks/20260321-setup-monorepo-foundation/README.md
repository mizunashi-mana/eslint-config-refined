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

- [ ] npm workspace が正しく構成されている
- [ ] `packages/eslint-config-refined` の `package.json` が適切に設定されている
- [ ] tsup でビルドが通る（`npm run build --workspaces`）
- [ ] Vitest でテストが通る（`npm test --workspaces`）
- [ ] ESLint で self-hosting lint が通る（`npm run lint:eslint --workspaces`）
- [ ] TypeScript の型チェックが通る（`npm run typecheck --workspaces`）
- [ ] GitHub Actions CI が設定されている

## 作業ログ

（作業開始後に記録）
