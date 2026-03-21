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

### 2. 前回リリースからの変更履歴を取得

`git log v{現在のバージョン}..HEAD --oneline` を実行し、前回リリース以降のコミット一覧を取得する。
タグが存在しない場合は、全コミットを表示する。

### 3. 新しいバージョンを決定

ユーザーが具体的なバージョン番号を指定している場合はそれを使用する。
指定がない場合は、変更履歴の概要（主な変更点を箇条書きで要約）を提示した上で、ユーザーにどのバージョンに上げるか確認する。

注意: 両パッケージは同じバージョンに揃える。eslint-config-refined が eslint-plugin-promise に依存しているため、バージョンの整合性を保つ必要がある。

### 4. ブランチを作成

`git checkout -b bump-version-{新バージョン}` でブランチを作成する。

### 5. バージョンを更新

以下のファイルの `"version"` フィールドを新しいバージョンに更新する:

- `packages/eslint-config-refined/package.json`
- `packages/eslint-plugin-promise/package.json`

また、`packages/eslint-config-refined/package.json` の `dependencies` にある `@mizunashi_mana/eslint-plugin-promise` のバージョン指定を `^{新バージョン}` に更新する。

### 6. package-lock.json を更新

`npm install` を実行し、`package-lock.json` に反映する。

### 7. コミット

変更をコミットする。メッセージ: `バージョンを {新バージョン} に更新`

### 8. PR を作成

`/autodev-create-pr` スキルを使って PR を作成する。

### 9. 結果を報告

更新前後のバージョンと PR の URL をユーザーに伝える。
