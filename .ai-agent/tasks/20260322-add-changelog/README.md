# add-changelog

## 目的・ゴール

各パッケージ（eslint-config-refined, eslint-plugin-promise）に CHANGELOG.md を作成し、bump-version スキルでバージョン更新時に CHANGELOG.md も更新するようにする。

## 実装方針

1. 各パッケージに CHANGELOG.md を作成（既存のリリース履歴を git log から復元）
2. bump-version スキルに CHANGELOG.md 更新ステップを追加

### CHANGELOG.md フォーマット

[Keep a Changelog](https://keepachangelog.com/) 形式を採用:

```markdown
# Changelog

## [0.2.0] - YYYY-MM-DD

### Added
- ...

### Changed
- ...
```

## 完了条件

- [x] `packages/eslint-config-refined/CHANGELOG.md` が作成されている
- [x] `packages/eslint-plugin-promise/CHANGELOG.md` が作成されている
- [x] bump-version スキルに CHANGELOG.md 更新手順が含まれている
- [x] PR が作成されている（https://github.com/mizunashi-mana/eslint-config-refined/pull/32）

## 作業ログ

- `packages/eslint-config-refined/CHANGELOG.md` 作成（v0.1.0, v0.2.0 の履歴を git log から復元）
- `packages/eslint-plugin-promise/CHANGELOG.md` 作成（v0.1.0, v0.2.0 の履歴を git log から復元）
- bump-version スキルに手順 7（CHANGELOG.md 更新）を追加、手順番号を整理
