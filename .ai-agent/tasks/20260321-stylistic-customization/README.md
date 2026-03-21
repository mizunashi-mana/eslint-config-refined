# スタイル設定のカスタマイズ性向上

## 目的・ゴール

`BuildConfigEnv` にスタイル設定のカスタマイズオプションを追加し、利用者がインデント幅やセミコロンの有無などを指定できるようにする。

## 実装方針

- `BuildConfigEnv` に `stylistic` オプションを追加
- `@stylistic/eslint-plugin` の `customize()` に渡すパラメータを外部から指定可能に
- デフォルト値は現行動作を維持（indent: 2, semi: true）

## 完了条件

- [x] `BuildConfigEnv` に `stylistic` オプションが追加されている
- [x] `buildStylisticConfig()` がオプションを受け取って反映する
- [x] デフォルト動作が変わらない（既存スナップショットが維持される）
- [x] カスタマイズ時のスナップショットテストが追加されている
- [x] ビルド・lint・テストがすべてパスする

## 作業ログ

- `StylisticOptions` インターフェースを `stylistic.config.ts` に追加（indent, semi, quotes, braceStyle, commaDangle）
- `BuildConfigEnv` に `stylistic` フィールドを追加、`StylisticOptions` を re-export
- `buildStylisticConfig()` にオプションを伝播
- カスタマイズ時のスナップショットテストを追加（indent:4, semi:false, quotes:double, braceStyle:1tbs, commaDangle:never）
- ビルド・typecheck・lint・テストすべてパス
