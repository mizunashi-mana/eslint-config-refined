# scaffold-eslint-plugin-promise

## プロジェクト

[eslint-plugin-promise v10 書き直し](../../projects/20260321-eslint-plugin-promise-v10/README.md) の T2

## 目的・ゴール

`packages/eslint-plugin-promise` パッケージのスキャフォールドを作成し、ルール実装に着手できる状態にする。

## 実装方針

- 既存の `packages/eslint-config-refined` の構成をミラーする
- ESM + TypeScript で構築
- ESLint v10 の Plugin API に準拠したエントリポイントを用意
- recommended config の空の雛形を用意

## 完了条件

- [x] package.json が作成され、npm workspace に含まれている
- [x] tsconfig.json / tsconfig.build.json が設定されている
- [x] tsup.config.ts でビルドが動作する
- [x] eslint.config.ts で lint が動作する
- [x] vitest.config.ts でテストが動作する
- [x] src/index.ts に plugin オブジェクトのエントリポイントがある
- [x] `npm run build --workspaces` / `npm test --workspaces` / `npm run typecheck --workspaces` が通る

## 作業ログ

- 2026-03-21: パッケージスキャフォールド作成完了。build / test / typecheck / lint 全て通過。
