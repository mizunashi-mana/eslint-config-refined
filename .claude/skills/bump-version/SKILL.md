---
description: Bump the package version. Use when you want to update the version number in package.json.
allowed-tools: Read, Edit, "Bash(npm install)", "Bash(git log*)", "Bash(git checkout -b *)", "Skill(autodev-create-pr)"
---

# バージョン更新

各パッケージの `package.json` のバージョンを更新し、PR を作成します。

## 手順

### 1. 現在のバージョンを確認

以下の2つの `package.json` を読み込み、現在のバージョンを確認する。

- `packages/eslint-config-refined/package.json`
- `packages/eslint-plugin-promise/package.json`

### 2. 対象パッケージを特定

ユーザーが対象パッケージを指定している場合はそれを使用する。
指定がない場合はユーザーに確認する。両方を同時に更新することも可能。

### 3. 前回リリースからの変更履歴を取得

対象パッケージごとに `git log v{パッケージ名}@{現在のバージョン}..HEAD --oneline -- packages/{パッケージディレクトリ}` を実行し、前回リリース以降の変更コミット一覧を取得する。
タグが存在しない場合は、全コミットを表示する。

### 4. 新しいバージョンを決定

ユーザーが具体的なバージョン番号を指定している場合はそれを使用する。
指定がない場合は、変更履歴の概要（主な変更点を箇条書きで要約）を提示した上で、パッケージごとにどのバージョンに上げるか確認する。

### 5. ブランチを作成

`git checkout -b bump-version-{パッケージ名}-{新バージョン}` でブランチを作成する。
複数パッケージを同時に更新する場合は適切なブランチ名を選ぶ。

### 6. バージョンを更新

対象パッケージの `package.json` の `"version"` フィールドを新しいバージョンに更新する。

eslint-plugin-promise のバージョンを更新した場合は、`packages/eslint-config-refined/package.json` の `dependencies` にある `@mizunashi_mana/eslint-plugin-promise` のバージョン指定も `^{新バージョン}` に更新する。

### 6. package-lock.json を更新

`npm install` を実行し、`package-lock.json` に反映する。

### 7. コミット

変更をコミットする。メッセージ: `{パッケージ名} のバージョンを {新バージョン} に更新`

### 8. PR を作成

`/autodev-create-pr` スキルを使って PR を作成する。

### 9. 結果を報告

更新前後のバージョンと PR の URL をユーザーに伝える。
