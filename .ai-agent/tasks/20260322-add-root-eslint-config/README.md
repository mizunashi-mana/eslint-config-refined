# root の ESLint 設定追加（scripts/ 向け）

## 目的・ゴール

root ディレクトリの `scripts/` 配下にある `.mjs` ファイルに対して ESLint を適用する。現在 `npx-eslint-pkg-root` フックは `devenv.nix` で設定済みだが、`eslint.config.*` がルートに存在しないため ESLint が動作しない。

## 実装方針

1. ルートに `eslint.config.mjs` を作成
   - `scripts/` の `.mjs` ファイルは純粋な Node.js スクリプト（TypeScript ではない）
   - `buildConfig()` は TypeScript 前提のため、そのまま使うのは不適切
   - `@eslint/js` の recommended をベースにした軽量な設定にする
2. devenv.nix の `npx-eslint-pkg-root` フックは既に `npx eslint --cache --fix` で設定済みなので変更不要
3. ルートの `package.json` に `lint:eslint` スクリプトを追加（一貫性のため）

## 完了条件

- [ ] ルートに `eslint.config.mjs` が作成されている
- [ ] `scripts/*.mjs` に対して ESLint が実行できる
- [ ] `npx eslint` がルートで動作する
- [ ] 既存のスクリプトが lint エラーなく通る（または修正済み）

## 作業ログ

（作業中に記録）
