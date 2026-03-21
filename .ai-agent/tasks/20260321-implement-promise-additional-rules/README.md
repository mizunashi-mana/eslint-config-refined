# implement-promise-additional-rules

## プロジェクト

[eslint-plugin-promise v10 書き直し](../../projects/20260321-eslint-plugin-promise-v10/README.md) の T4

## 目的・ゴール

追加の 3 ルールを実装する。

## 対象ルール

1. `no-callback-in-promise` - promise 内のコールバック禁止
2. `no-return-in-finally` - finally 内の return 禁止
3. `prefer-await-to-then` - then() より await を推奨

## 完了条件

- [x] 3 ルール全てが実装されている
- [x] 各ルールにテストがある
- [x] build / test / typecheck / lint が通る

## 作業ログ

- 2026-03-21: 3 ルール実装完了（no-callback-in-promise, no-return-in-finally, prefer-await-to-then）
