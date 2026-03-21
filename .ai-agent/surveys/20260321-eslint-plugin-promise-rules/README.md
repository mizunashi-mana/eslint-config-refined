# eslint-plugin-promise ルール調査

## 調査の問い

- eslint-plugin-promise v7 にはどのようなルールがあり、それぞれ何をするか
- ESLint v10 Rule API で再実装する際の方針はどうあるべきか
- typescript-eslint との重複をどう扱うか
- どのルールを優先的に実装すべきか

## 背景

- プロジェクト: [eslint-plugin-promise v10 書き直し](../../projects/20260321-eslint-plugin-promise-v10/README.md) の T1
- eslint-plugin-promise v7 は ESLint v10 を peerDependencies でサポートしていない（PR #617 がドラフト状態）
- 移植元リポジトリでは eslint-plugin-promise v7 を使用しており、同等の機能が必要

## 調査方法

- eslint-plugin-promise GitHub リポジトリ（eslint-community/eslint-plugin-promise）のソースコード・ドキュメント調査
- ESLint v10 公式ドキュメント・マイグレーションガイドの調査
- eslint-config-refined の既存プラグイン利用パターンの分析

## 調査結果

### eslint-plugin-promise v7 の全ルール一覧

**ライセンス**: ISC
**モジュール形式**: CommonJS
**ESLint v10 対応状況**: 未対応（PR #617 ドラフト中、#611 のバグ修正が前提）

#### recommended config に含まれるルール（10 ルール）

| ルール | recommended レベル | fixable | 概要 |
|--------|-------------------|---------|------|
| `always-return` | error | No | `then()` 内で値を return することを強制 |
| `catch-or-return` | error | No | 返されない promise に `catch()` を強制 |
| `no-return-wrap` | error | No | 不要な `Promise.resolve/reject` ラップを禁止 |
| `param-names` | error | No | Promise コンストラクタの引数名を統一 |
| `no-new-statics` | error | Yes | Promise 静的メソッドの `new` を禁止 |
| `no-nesting` | warn | No | promise のネストを禁止 |
| `no-promise-in-callback` | warn | No | コールバック内での promise 使用を禁止 |
| `no-callback-in-promise` | warn | No | `then()` 内でのコールバック呼び出しを禁止 |
| `no-return-in-finally` | warn | No | `finally()` 内の return を禁止 |
| `valid-params` | warn | No | Promise メソッドの引数数をチェック |

※ `avoid-new` と `no-native` は recommended で明示的に `off` に設定されている。

#### recommended config に含まれないルール（5 ルール）

| ルール | fixable | 概要 |
|--------|---------|------|
| `no-multiple-resolved` | No | 複数回の resolve/reject を検出（コードパス解析） |
| `prefer-await-to-then` | No | `then()` より `await` を推奨 |
| `prefer-await-to-callbacks` | No | コールバックより `async/await` を推奨 |
| `prefer-catch` | Yes | `then(a, b)` より `catch()` を推奨 |
| `spec-only` | No | 非標準 Promise メソッドを禁止 |

#### 非推奨/レガシールール（2 ルール）

| ルール | 概要 | 備考 |
|--------|------|------|
| `avoid-new` | `new Promise()` を禁止 | 実用的でないため recommended で off |
| `no-native` | ネイティブ Promise を禁止 | ES5 向け。ESLint v9+ でバグあり（#611） |

### typescript-eslint との重複分析

| promise ルール | typescript-eslint の対応ルール | 関係 |
|----------------|-------------------------------|------|
| `catch-or-return` | `@typescript-eslint/no-floating-promises` | 部分的に重複。no-floating-promises は型ベースで厳密。catch-or-return はパターンベースで異なる観点 |
| `no-return-wrap` | （なし） | 重複なし |
| `always-return` | （なし） | 重複なし。typescript-eslint にはない独自の価値 |
| `param-names` | （なし） | 重複なし |

**結論**: 重複は `catch-or-return` と `no-floating-promises` のみで、両者は補完的。併用して問題ない。

### ESLint v10 Rule API の要点

#### v9 → v10 の主な変更点

- `context.getCwd()` → `context.cwd`
- `context.getFilename()` → `context.filename`
- `context.getSourceCode()` → `context.sourceCode`
- `context.parserOptions` → `context.languageOptions.parserOptions`
- `SourceCode.isSpaceBetweenTokens()` → `isSpaceBetween()`
- Fixer の `text` 引数が string 以外で TypeError

#### プラグイン構造

```typescript
const plugin: ESLint.Plugin = {
  meta: {
    name: "@mizunashi_mana/eslint-plugin-promise",
    version: "0.0.0",
    namespace: "@mizunashi_mana/promise",  // ルール参照時のプレフィックス
  },
  rules: { /* ... */ },
  configs: {},
};

// 自己参照パターンで recommended config を定義
Object.assign(plugin.configs, {
  recommended: [{
    plugins: { "@mizunashi_mana/promise": plugin },
    rules: { /* ... */ },
  }],
});
```

#### eslint-config-refined での利用パターン

既存プラグインの利用パターンは3つ:
1. プラグインの preset config を使う（import-x）
2. 手動でプラグイン登録してルール設定（eslint-comments）
3. プラグインの named config を使う（eslint-plugin-n）

promise プラグインでは **パターン 1（recommended config を提供）** が最適。

### 移植元リポジトリでの使用状況

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

**使用ルール（recommended + カスタム）:**
- recommended の 10 ルール全て（デフォルト設定）
- `always-return`: `ignoreLastCallback: true` に変更
- `no-multiple-resolved`: 明示的に error に追加
- `no-promise-in-callback`: recommended では warn → error に昇格

## 結論

### 実装対象ルールと優先度

#### 優先度 高（T3 で実装）

移植元で使用されているルール + 重要な recommended ルール:

1. **`always-return`** - 独自の価値が高い。`ignoreLastCallback` オプション必須
2. **`catch-or-return`** - promise エラーハンドリングの基本
3. **`no-return-wrap`** - 不要なラップの検出
4. **`param-names`** - シンプルなルール
5. **`no-new-statics`** - fixable。シンプル
6. **`valid-params`** - 引数数チェック
7. **`no-multiple-resolved`** - 移植元で明示的に有効化。実装は複雑（コードパス解析）
8. **`no-promise-in-callback`** - 移植元で error に昇格
9. **`no-nesting`** - promise のネスト禁止。recommended（warn）

#### 優先度 中（T4 で実装）

10. **`no-callback-in-promise`** - recommended（warn）
11. **`no-return-in-finally`** - recommended（warn）
12. **`prefer-await-to-then`** - then() より await を推奨

#### 優先度 低（将来検討）

13. **`spec-only`** - 必要になったら実装

#### 実装しない

- **`avoid-new`** - 実用的でない
- **`no-native`** - ES5 向け。不要
- **`prefer-await-to-callbacks`** - TypeScript プロジェクトでは有用性が限定的
- **`prefer-catch`** - 優先度が低い

### 実装方針

1. **フルスクラッチで TypeScript 実装** - eslint-plugin-promise は CommonJS。ESM + TypeScript で書き直す
2. **ESLint v10 のみサポート** - v9 以前との互換性は不要
3. **ルールのオプションは移植元の使用状況に合わせて取捨選択** - 使わないオプションは初期実装では省略可
4. **テストは eslint-plugin-promise のテストケースを参考に** - 網羅的なケースを移植
5. **共有ユーティリティ** を `rules/lib/` に整理（promise 判定、コールバック判定など）

### リスク・注意点

- `no-multiple-resolved` はコードパス解析が必要で実装が複雑（ソースコード ~15KB）
- `always-return` もコードパス解析を使用しており、中程度の複雑さ
- eslint-plugin-promise の ISC ライセンスはテストケースの参考利用に問題なし

## 参考リンク

- [eslint-plugin-promise GitHub](https://github.com/eslint-community/eslint-plugin-promise)
- [ESLint v10 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [ESLint Plugin Authoring Guide](https://eslint.org/docs/latest/extend/plugins)
- [eslint-plugin-promise ESLint v10 PR #617](https://github.com/eslint-community/eslint-plugin-promise/pull/617)
