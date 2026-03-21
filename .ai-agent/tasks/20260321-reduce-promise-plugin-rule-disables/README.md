# eslint-plugin-promise の eslint.config.ts ルール無効化を減らす

## 目的・ゴール

`packages/eslint-plugin-promise/eslint.config.ts` で TODO コメント付きで無効化されている 9 つのルールについて、ソースコードの違反を修正し、ルールを再有効化する。

## 無効化中のルール（TODO）

| ルール | 違反数 |
|---|---|
| `@typescript-eslint/strict-boolean-expressions` | 10 |
| `@typescript-eslint/no-unnecessary-condition` | 12 |
| `@typescript-eslint/no-non-null-assertion` | 5 |
| `@typescript-eslint/no-unnecessary-type-conversion` | 2 |
| `complexity` | 1 |
| `eqeqeq` | 2 |
| `no-plusplus` | 1 |
| `require-unicode-regexp` | 2 |
| `@stylistic/max-statements-per-line` | 2 |

合計: 43 violations

## 実装方針

1. 各ファイルの違反箇所を修正
2. テストが通ることを確認しながら進める
3. 修正完了後、eslint.config.ts から TODO ルールの無効化を削除
4. 最終的に lint + test が通ることを確認

## 完了条件

- [x] 全 43 violations を修正
- [x] eslint.config.ts から TODO セクションの 9 ルール無効化を削除
- [x] `npm run lint:eslint --workspaces` が通る
- [x] `npm test --workspaces` が通る

## 作業ログ

- 全 13 ファイルの lint 違反を修正
- catch-or-return.ts: complexity 削減のためヘルパー関数を抽出
- noUncheckedIndexedAccess 有効化に合わせて配列インデックスアクセスにガードを追加
- require-unicode-regexp: Node >= 20 制約の追加により v フラグを使用可能に
- eslint.config.ts から TODO セクションの 9 ルール無効化を削除
- typecheck / lint / test すべて通過
