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

- モノレポ基盤（npm workspaces）のセットアップ
- コア ESLint 設定（globals, js, ts, stylistic, imports, comments, node）
- React ルールセット（eslint-plugin-react-x）
- Playwright / Storybook ルールセット
- eslint-plugin-promise の統合
- stylistic カスタマイズオプション
- eslint-config-love とのギャップ分析に基づくルール拡充
- スナップショットテスト
- ビルドツールを tsdown に移行
- パスエイリアスによる no-restricted-imports オーバーライドの排除
- セルフ lint の適用
