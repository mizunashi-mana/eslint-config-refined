# path alias 導入と no-restricted-imports 無効化の解消

## 目的・ゴール

各パッケージに Node.js subpath imports (`#src/*`) を設定し、`../` 相対インポートを排除することで、`no-restricted-imports` ルールの無効化オーバーライドを削除する。

## 実装方針

Node.js subpath imports を利用する（`package.json` の `imports` フィールド）。`moduleResolution: "Node16"` により TypeScript がネイティブサポートしているため、追加ツール不要。

### 変更対象

1. **eslint-config-refined**
   - `package.json`: `imports` フィールド追加 (`#src/*` → `./src/*`)
   - `tests/helpers.ts`: `../src/index.js` → `#src/index.js`
   - `eslint.config.ts`: tests の `no-restricted-imports: 'off'` を削除

2. **eslint-plugin-promise**
   - `package.json`: `imports` フィールド追加 (`#src/*` → `./src/*`)
   - `src/rules/*.ts`: `../lib/*.js` → `#src/lib/*.js`
   - `eslint.config.ts`: src/tests の `no-restricted-imports: 'off'` を削除

## 完了条件

- [x] eslint-plugin-promise で `#lib` subpath import が設定されている
- [x] eslint-config-refined テストがパッケージ名でセルフリファレンスしている
- [x] `../` 相対インポートが解消されている
- [x] `no-restricted-imports: 'off'` オーバーライドが両 eslint.config.ts から削除されている
- [x] ビルド (`npm run build --workspaces`) が成功する
- [x] テスト (`npm test --workspaces`) が成功する
- [x] Lint (`npm run lint:eslint --workspaces`) が成功する
- [x] 型チェック (`npm run typecheck --workspaces`) が成功する

## 作業ログ

- eslint-config-refined: テストの `../src/index.js` を `@mizunashi_mana/eslint-config-refined` パッケージ名に変更
- eslint-plugin-promise: `src/lib/index.ts` バレルファイル作成、`#lib` subpath import 設定、各 rules ファイルのインポートを `#lib` に統一
- 両パッケージの eslint.config.ts から `no-restricted-imports: 'off'` を削除
