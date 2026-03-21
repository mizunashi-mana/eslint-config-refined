# CI: composite action によるセットアップ共通化とジョブ分離

## 目的・ゴール

GitHub Actions の CI ワークフローを改善する:

1. composite action でセットアップ手順（checkout, setup-node, npm ci）を共通化
2. lint と test をそれぞれ独立したジョブに分離し、並列実行を可能にする

## 実装方針

参考: [mcp-html-artifacts-preview/.github](https://github.com/mizunashi-mana/mcp-html-artifacts-preview/tree/main/.github)

### 作成するファイル

- `.github/actions/setup-devenv/action.yml` - devenv セットアップの composite action
- `.github/actions/setup-node/action.yml` - Node.js セットアップの composite action
- `.github/workflows/ci-lint.yml` - devenv + prek による Lint ジョブ
- `.github/workflows/ci-test.yml` - Build + Test ジョブ

### composite action (setup-devenv)

- Nix のインストール（cachix/install-nix-action）
- cachix キャッシュの設定（devenv 用）
- devenv のインストールと初期化

### composite action (setup-node)

- npm キャッシュの設定
- Node.js v24 のセットアップ（skip-node-install オプションで省略可能）
- `npm ci` による依存関係インストール（use-devenv オプションで devenv shell 経由も可能）

### ワークフロー分離

- `ci-lint.yml`: devenv + setup-node(skip-node-install, use-devenv) → `prek run --all-files`
- `ci-test.yml`: setup-node → build → test
- 既存の `ci.yml` は削除
- concurrency グループを設定して、同一ブランチの古い実行をキャンセル

## 完了条件

- [ ] `.github/actions/setup-devenv/action.yml` が作成されている
- [ ] `.github/actions/setup-node/action.yml` が作成されている
- [ ] `.github/workflows/ci-lint.yml` が作成されている
- [ ] `.github/workflows/ci-test.yml` が作成されている
- [ ] `.github/workflows/ci.yml` が削除されている
- [ ] 各ワークフローが composite action を使用している
- [ ] concurrency グループが設定されている

## 作業ログ

- composite action 2つ（setup-devenv, setup-node）を作成
- ci-lint.yml（devenv + prek）と ci-test.yml（Node.js + npm test）を作成
- 旧 ci.yml を削除
- actionlint パス確認済み
- steering ドキュメント（structure.md, tech.md, plan.md）を現状に合わせて更新
