# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-03-22

### Changed

- npm 公開用メタデータを package.json に追加
- npm バッジを README に移動

## [0.1.0] - 2026-03-21

### Added

- パッケージの初期スキャフォールド
- 9 つのコア Promise ルールの実装
- 追加ルール: no-callback-in-promise, no-return-in-finally, prefer-await-to-then
- ESLint v10 向けの no-multiple-resolved セレクタ修正
- no-unsafe-type-assertion / naming-convention の有効化
- セルフ lint の適用
- ビルドツールを tsdown に移行
- パスエイリアスによる no-restricted-imports オーバーライドの排除
