# eslint-plugin-promise v10 書き直し

## 目標

- eslint-plugin-promise の主要ルールを ESLint v10 の Rule API に準拠して再実装する
- `@mizunashi_mana/eslint-plugin-promise` パッケージとして公開可能な状態にする
- eslint-config-refined に promise ルールセットを統合する

### 完了条件

- [ ] 移植元リポジトリで使用している promise ルールが全て動作する
- [ ] eslint-config-refined の `common` ルールセットに promise が含まれる
- [ ] テストが整備されている
- [ ] CI が通る

## スコープ

### やること

- eslint-plugin-promise の既存ルールの調査・設計
- ESLint v10 Rule API に準拠したルールの再実装
- 各ルールのテスト整備
- eslint-config-refined への promise.config.ts 追加・統合
- recommended config の提供

### やらないこと

- eslint-plugin-promise の全ルールの実装（使用するルールを優先）
- ESLint v9 以前との互換性維持
- eslint-plugin-promise との API 互換性（ルール名は同じにするが、オプションは見直す）

## タスク分解

| ID | タスク | 依存 | 優先度 | 状態 |
|----|--------|------|--------|------|
| T1 | eslint-plugin-promise ルール調査 | - | 高 | 完了 |
| T2 | パッケージ基盤構築 | - | 高 | 完了 |
| T3 | recommended ルール実装 | T1, T2 | 高 | 未着手 |
| T4 | 追加ルール実装 | T3 | 中 | 未着手 |
| T5 | eslint-config-refined 統合 | T3 | 高 | 未着手 |

### 依存関係図

```
T1 ─→ T3 ─→ T4
T2 ─↗    ↘
          T5
```

### 各タスクの詳細

#### T1: eslint-plugin-promise ルール調査

- 概要: eslint-plugin-promise v7 の全ルールを調査し、実装対象・優先度・設計方針を決定する
- 完了条件:
  - 全ルールの一覧と各ルールの動作仕様を把握
  - 実装対象ルールの選定と優先度付け
  - ESLint v10 Rule API での実装方針をまとめる
- 形式: `/autodev-start-new-survey` で実施

#### T2: パッケージ基盤構築

- 概要: `packages/eslint-plugin-promise` のパッケージスキャフォールドを作成する
- 完了条件:
  - package.json、tsconfig.json、tsup.config.ts の設定
  - ビルド・テスト・lint が動作する
  - CI で新パッケージが対象になる
  - plugin オブジェクトのエントリポイント（src/index.ts）

#### T3: 主要ルール実装

- 概要: 移植元リポジトリで使用しているルール + 重要な recommended ルールを実装する
- 対象ルール（9 ルール）:
  - `always-return` - then() 内での return を強制
  - `catch-or-return` - promise の catch 処理を強制
  - `no-return-wrap` - 不要な Promise.resolve/reject ラップの禁止
  - `param-names` - Promise コンストラクタの引数名の統一
  - `no-new-statics` - Promise 静的メソッドの new 禁止（fixable）
  - `valid-params` - Promise メソッドの引数数チェック
  - `no-multiple-resolved` - 複数回の resolve/reject を禁止
  - `no-promise-in-callback` - コールバック内での promise 使用禁止
  - `no-nesting` - promise のネスト禁止
- 完了条件:
  - 上記ルールが実装され、テストが通る
  - recommended config が提供される

#### T4: 追加ルール実装

- 概要: 残りの有用なルールを実装する
- 対象ルール（3 ルール）:
  - `no-callback-in-promise` - promise 内のコールバック禁止
  - `no-return-in-finally` - finally 内の return 禁止
  - `prefer-await-to-then` - then より await を推奨
- 完了条件:
  - 上記ルールが実装され、テストが通る

#### T5: eslint-config-refined 統合

- 概要: eslint-config-refined に promise.config.ts を追加し、common ルールセットに統合する
- 完了条件:
  - promise.config.ts が作成される
  - `common` ルールセットに promise が含まれる
  - テストスナップショットが更新される
  - 移植元リポジトリと同等の設定が再現される

## 進捗

- 2026-03-21: プロジェクト開始
- 2026-03-21: T1 完了 - ルール調査結果を surveys/20260321-eslint-plugin-promise-rules/ に記録
- 2026-03-21: T2 完了 - packages/eslint-plugin-promise のスキャフォールド作成

## メモ

### 移植元の promise 設定

移植元3リポジトリでは eslint-plugin-promise v7.2.1 を以下の設定で使用:

```typescript
promisePlugin.configs['flat/recommended'],
{
  rules: {
    'promise/always-return': ['error', { ignoreLastCallback: true }],
    'promise/no-multiple-resolved': 'error',
    'promise/no-promise-in-callback': 'error',
    '@typescript-eslint/require-await': 'off',
  },
}
```

### typescript-eslint との重複

以下のルールは typescript-eslint 側で既にカバーされている:
- `@typescript-eslint/no-floating-promises` (≒ catch-or-return の一部)
- `@typescript-eslint/no-misused-promises`
- `@typescript-eslint/prefer-promise-reject-errors`
- `@typescript-eslint/promise-function-async`

重複するルールの扱いは T1 の調査で方針を決定する。
