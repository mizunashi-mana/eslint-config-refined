# パッケージ README 作成 & バージョン更新スキル作成

## 目的・ゴール

npm 公開に向けて、各パッケージの README.md を作成する。また、バージョン更新を効率化するための bump-version スキルを作成する。

## 実装方針

### 1. パッケージ README 作成

各パッケージの `packages/*/README.md` を作成する。

- **eslint-config-refined**: パッケージの概要、インストール、使い方（buildConfig の各オプション）、利用可能なルールセット、ライセンス
- **eslint-plugin-promise**: パッケージの概要、インストール、提供ルール一覧、recommended config の使い方、ライセンス

### 2. bump-version スキル作成

参考: mcp-html-artifacts-preview の bump-version スキル。モノレポ対応に拡張する。

- 対象パッケージの選択（単一 or 全パッケージ）
- 変更履歴の取得・表示
- バージョン更新・npm install・コミット・PR 作成

## 完了条件

- [x] `packages/eslint-config-refined/README.md` が作成されている
- [x] `packages/eslint-plugin-promise/README.md` が作成されている
- [x] `.claude/skills/bump-version/SKILL.md` が作成されている
- [x] lint / typecheck が通る

## 作業ログ

- 2026-03-21: 全タスク完了。パッケージ README 2つと bump-version スキルを作成
