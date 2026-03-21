# tsup から tsdown への移行

## 目的・ゴール

- ビルドツールを tsup から tsdown に移行する
- tsdown の tsconfig paths 自動解決により、path alias が使える基盤を整える

## 背景

- tsup のメンテナンスが停滞（最終コミット 2025-11-12）
- tsdown は tsup の精神的後継で、Rolldown ベースの高速ビルドを提供
- 調査結果: `.ai-agent/surveys/20260321-tsup-alternative-build-tool/README.md`

## 実装方針

1. tsdown をインストールし、tsup を削除
2. tsup.config.ts を tsdown.config.ts に変換
3. package.json の build スクリプトを更新
4. ビルド・テスト・lint が通ることを確認
5. tech.md を更新

## 完了条件

- [x] 両パッケージで tsup → tsdown に移行完了
- [x] `npm run build --workspaces` が成功
- [x] `npm test --workspaces` が成功
- [x] `npm run lint:eslint --workspaces` が成功
- [x] `npm run typecheck --workspaces` が成功
- [x] tech.md のビルドツール記載を更新

## 作業ログ

- tsdown v0.21.4 をインストール、tsup を削除
- tsdown.config.ts を作成（`fixedExtension: false` で `.js`/`.d.ts` 出力に設定）
- build スクリプトを `tsdown` に変更
- 全チェック（build, test, lint, typecheck）通過を確認
- tech.md を更新
