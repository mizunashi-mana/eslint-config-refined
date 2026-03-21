# README に CI バッジ・npm バッジを追加

## 目的・ゴール

README.md のタイトル直下に、プロジェクトの状態を一目で把握できるバッジを追加する。

## 実装方針

- CI バッジ: GitHub Actions の各ワークフロー（CI Lint, CI Test）のステータスバッジを追加
- npm バッジ: 各パッケージ（`@mizunashi_mana/eslint-config-refined`, `@mizunashi_mana/eslint-plugin-promise`）の npm バージョンバッジを追加
- バッジは `# eslint-config-refined` タイトルの直後に配置

## 完了条件

- [x] README.md に CI Lint / CI Test のステータスバッジが表示される
- [x] README.md に各パッケージの npm バージョンバッジが表示される
- [x] バッジのリンク先が適切に設定されている

## 作業ログ

- README.md タイトル直下に CI Lint / CI Test / npm バッジ x2 を追加
