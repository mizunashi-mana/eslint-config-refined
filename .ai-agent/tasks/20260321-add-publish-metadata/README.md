# add-publish-metadata

## 目的・ゴール

npm 公開に向けて、各パッケージの package.json に公開パッケージ用のメタデータを追加する。

## 実装方針

両パッケージ（eslint-config-refined, eslint-plugin-promise）の package.json に以下のフィールドを追加:

- `repository` — GitHub リポジトリ情報（monorepo の directory 指定付き）
- `homepage` — パッケージの README への GitHub リンク
- `bugs` — GitHub Issues URL
- `author` — 作者情報
- `keywords` — npm 検索用キーワード

## 完了条件

- [x] eslint-config-refined の package.json にメタデータ追加
- [x] eslint-plugin-promise の package.json にメタデータ追加
- [x] `npm pack --dry-run` で公開内容を確認

## 作業ログ

- 両パッケージに repository, homepage, bugs, author, keywords, publishConfig を追加
- npm pack --dry-run で公開内容確認済み（dist, LICENSE, README.md が含まれる）
