# Playwright・Storybook 対応追加

## 目的・ゴール

eslint-config-refined に Playwright と Storybook 用の ESLint 設定を追加し、RuleSet として利用可能にする。

## 参考

- [picstash eslint-config](https://github.com/mizunashi-mana/picstash/tree/main/packages/eslint-config/src)
  - `playwright.config.ts` - eslint-plugin-playwright の flat/recommended + 追加ルール
  - `storybook.config.ts` - eslint-plugin-storybook の flat/recommended

## 実装方針

1. `eslint-plugin-playwright` と `eslint-plugin-storybook` を dependencies に追加
2. `src/playwright.config.ts` を作成（picstash 準拠）
   - `files` パラメータでテストファイルパターンを指定可能に
   - `playwright/no-conditional-in-test`, `no-conditional-expect`, `expect-expect` を error に設定
3. `src/storybook.config.ts` を作成（picstash 準拠）
   - `eslint-plugin-storybook` の flat/recommended をそのまま利用
4. `src/index.ts` の RuleSet に `"playwright"` と `"storybook"` を追加
5. テストを追加

## 完了条件

- [x] `src/playwright.config.ts` が作成されている
- [x] `src/storybook.config.ts` が作成されている
- [x] `src/index.ts` に playwright, storybook の RuleSet が追加されている
- [x] テストが追加され、パスしている
- [x] lint, typecheck がパスしている

## 作業ログ

- 2026-03-21: タスク開始
- 2026-03-21: 実装完了。全テスト・lint・typecheck パス
