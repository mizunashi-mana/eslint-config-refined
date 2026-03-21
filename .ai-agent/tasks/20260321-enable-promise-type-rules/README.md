# enable-promise-type-rules

## 目的・ゴール

`packages/eslint-plugin-promise/eslint.config.ts` で一括無効化されている `@typescript-eslint/no-unsafe-type-assertion` と `@typescript-eslint/naming-convention` を有効化し、必要な箇所では個別にインラインで無効化して理由を付ける。

## 実装方針

1. `eslint.config.ts` から2つのルールの `'off'` を削除
2. 各ソースファイルの違反箇所にインライン `eslint-disable` コメントを理由付きで追加
   - `naming-convention`: ESLint rule visitor のメソッド名は AST ノード名（PascalCase）やセレクタを使うため
   - `no-unsafe-type-assertion`: ESLint Rule API の AST ノード型アサーション

## 完了条件

- [x] `eslint.config.ts` から `naming-convention` と `no-unsafe-type-assertion` の `'off'` が削除されている
- [x] `npm run lint:eslint -w packages/eslint-plugin-promise` がパスする
- [x] 各インライン無効化に理由が記載されている

## 作業ログ

- `eslint.config.ts` から2ルールの一括 off を削除
- 13箇所の `naming-convention` 違反にインライン disable コメントを追加（AST ノード名/セレクタ使用のため）
- 20箇所の `no-unsafe-type-assertion` 違反にインライン disable コメントを追加（ESLint API の型制約のため）
- lint・テストともにパス確認
