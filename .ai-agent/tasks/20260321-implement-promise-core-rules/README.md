# implement-promise-core-rules

## プロジェクト

[eslint-plugin-promise v10 書き直し](../../projects/20260321-eslint-plugin-promise-v10/README.md) の T3

## 目的・ゴール

eslint-plugin-promise の主要 9 ルールを ESLint v10 Rule API で実装し、recommended config を提供する。

## 対象ルール

1. `param-names` - Promise コンストラクタの引数名チェック
2. `no-new-statics` - Promise 静的メソッドの new 禁止（fixable）
3. `valid-params` - Promise メソッドの引数数チェック
4. `no-nesting` - promise のネスト禁止
5. `no-return-wrap` - 不要な Promise.resolve/reject ラップ禁止
6. `no-promise-in-callback` - コールバック内での promise 使用禁止
7. `catch-or-return` - 未 catch の promise 検出
8. `always-return` - then() 内の return 強制
9. `no-multiple-resolved` - 複数回の resolve/reject 検出

## 実装方針

- シンプルなルールから順に実装
- 共有ユーティリティを `src/lib/` に整理
- 各ルールにテストを整備
- eslint-plugin-promise のテストケースを参考に

## 完了条件

- [x] 9 ルール全てが実装されている
- [x] 各ルールにテストがある
- [x] recommended config にルールが登録されている
- [x] build / test / typecheck / lint が通る

## 作業ログ

- 2026-03-21: 共有ユーティリティ（lib/）と 9 ルール実装完了。テスト 17 件全て通過。
