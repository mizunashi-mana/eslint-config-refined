# ESLint v10 および依存パッケージのアップグレード

## 目的・ゴール

npm outdated で報告される全パッケージをアップグレードし、outdated をゼロにする。

## アップグレード対象

| パッケージ | 現在 | 目標 | 種別 |
|---|---|---|---|
| `eslint` | ^9.24.0 | ^10.0.0 | devDependencies + peerDependencies |
| `@eslint/js` | ^9.39.4 | ^10.0.0 | dependencies |
| `globals` | ^14.0.0 | ^17.0.0 | dependencies |
| `vitest` | ^3.1.4 | ^4.0.0 | devDependencies |

## 実装方針

1. 各パッケージの破壊的変更を確認
2. package.json のバージョン指定を更新
3. npm install で依存解決
4. ビルド・テスト・lint が通ることを確認
5. 必要に応じてコードを修正

## 完了条件

- [x] `npm outdated` の出力がゼロ
- [x] `npm run build --workspaces` が成功
- [x] `npm test --workspaces` が成功
- [x] `npm run lint:eslint --workspaces` が成功
- [x] `npm run typecheck --workspaces` が成功

## 作業ログ

- package.json のバージョン指定を更新（eslint, @eslint/js, globals, vitest）
- npm install で依存解決成功
- ビルド成功
- テストはスナップショット差分で失敗 → globals v17 の新グローバル変数追加と @eslint/js v10 の recommended ルール更新（no-unassigned-vars, no-useless-assignment, preserve-caught-error 追加）による期待通りの変更 → スナップショット更新で解決
- lint・typecheck 成功
