# eslint-config-refined ディレクトリ構成

## 全体構造

```
eslint-config-refined/
├── .ai-agent/                          # AI エージェント向けドキュメント
│   ├── steering/                       # 戦略的ガイドドキュメント
│   │   ├── product.md                  # プロダクトビジョン・戦略
│   │   ├── tech.md                     # 技術アーキテクチャ・スタック
│   │   ├── market.md                   # 市場分析・競合調査
│   │   ├── plan.md                     # 実装計画・ロードマップ
│   │   └── work.md                     # 開発ワークフロー・規約
│   ├── structure.md                    # 本ファイル（ディレクトリ構成の説明）
│   ├── projects/                       # 長期プロジェクト管理
│   ├── tasks/                          # 個別タスク管理
│   └── surveys/                        # 技術調査・検討
├── .claude/                            # Claude Code 設定
│   ├── settings.local.json             # ローカル設定
│   └── skills/                         # autodev スキル
│       ├── autodev-create-issue/       # GitHub Issue 作成
│       ├── autodev-create-pr/          # PR 作成
│       ├── autodev-discussion/         # 対話的なアイデア整理
│       ├── autodev-import-review-suggestions/  # レビュー指摘の取り込み
│       ├── autodev-replan/             # ロードマップ再策定
│       ├── autodev-review-pr/          # PR コードレビュー（GitHub Review）
│       ├── autodev-start-new-project/  # 長期プロジェクト開始
│       ├── autodev-start-new-survey/   # 技術調査開始
│       ├── autodev-start-new-task/     # 個別タスク開始
│       ├── autodev-steering/           # Steering ドキュメント更新
│       ├── autodev-switch-to-default/  # デフォルトブランチ切り替え
│       └── bump-version/              # パッケージバージョン更新
├── .github/                            # GitHub 設定
│   ├── actions/                        # composite actions
│   │   ├── setup-devenv/               # devenv セットアップ（Nix, cachix, devenv）
│   │   └── setup-node/                 # Node.js セットアップ（npm キャッシュ, npm ci）
│   ├── dependabot.yml                  # Dependabot 設定
│   └── workflows/                      # GitHub Actions ワークフロー
│       ├── ci-lint.yml                 # Lint ワークフロー（devenv + prek）
│       ├── ci-test.yml                 # テストワークフロー（Node.js + npm test）
│       └── publish.yml                 # npm 公開ワークフロー（手動トリガー）
├── packages/                           # npm パッケージ群
│   ├── eslint-config-refined/          # メインの共有 ESLint 設定
│   └── eslint-plugin-promise/          # eslint-plugin-promise の ESLint v10 用書き直し
├── scripts/                            # 開発用スクリプト
│   ├── cc-edit-lint-hook.mjs           # Claude Code 編集時の lint フック
│   └── run-script.mjs                  # パッケージ内スクリプト実行ヘルパー
├── devenv.nix                          # devenv 設定（開発環境・git-hooks）
├── devenv.yaml                         # devenv 入力ソース設定
├── .pre-commit-config.yaml             # pre-commit（prek）設定
├── tsconfig.base.json                  # TypeScript ベース設定（パッケージ共通）
├── tsconfig.json                       # ルート TypeScript 設定
├── CLAUDE.md                           # Claude Code 向けプロジェクト説明
├── README.md                           # プロジェクト README
└── LICENSE                             # ライセンスファイル
```

## パッケージ構成

npm workspace によるモノレポ構成。各パッケージは `packages/` 配下に配置される。

### packages/eslint-config-refined

メインの共有 ESLint 設定パッケージ。`buildConfig()` ユーティリティを提供し、モジュラーなサブ設定（js, ts, stylistic, imports, node, comments, react, playwright, storybook）を組み合わせる。

### packages/eslint-plugin-promise

eslint-plugin-promise の ESLint v10 対応書き直し。11 個のカスタムルールを提供する。

## .ai-agent/ ディレクトリ

AI エージェントによる開発を支援するドキュメント群。

- **steering/**: プロジェクトの方向性を定義する戦略ドキュメント
- **projects/**: 複数タスクにまたがる長期的な目標の管理
- **tasks/**: 日〜週単位の個別作業の管理
- **surveys/**: 技術調査・比較検討の記録

## .claude/skills/ ディレクトリ

Claude Code の autodev スキル群。開発ワークフローの各フェーズを支援する。レビュー形式は GitHub Review を使用。
