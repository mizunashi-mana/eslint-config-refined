# add-publish-workflow

## 目的・ゴール

各パッケージを個別に npm publish できる GitHub Actions ワークフローを作成する。

## 実装方針

- `workflow_dispatch` で対象パッケージを選択して publish できるようにする
- タグ形式: `{パッケージ名}-{バージョン}`（例: `eslint-config-refined-0.1.0`）
- 参考: `mizunashi-mana/mcp-html-artifacts-preview` の publish.yml
- build → test → publish → tag/release の流れ
- 各パッケージの dist をアーティファクトとして受け渡し

## 完了条件

- [ ] `.github/workflows/publish.yml` が作成されている
- [ ] `workflow_dispatch` で対象パッケージを選択できる
- [ ] 選択したパッケージのみ publish される
- [ ] タグが `{パッケージ名}-{バージョン}` 形式で作成される
- [ ] build & test が publish 前に実行される

## 作業ログ

- 2026-03-21: タスク開始
