# picstash eslint-config との差分調査

## 調査の問い

- eslint-config-refined と picstash の eslint-config の間にどのようなルール差分があるか
- picstash にあって refined にない有用なルールや設定はあるか

## 背景

- eslint-config-refined は picstash の eslint-config をベースに汎用化・改善したプロジェクト
- 差分を把握することで、取り込むべき設定や意図的に変更した箇所を明確にする

## 調査方法

- GitHub API で picstash の `packages/eslint-config/src/` を取得
- eslint-config-refined の `packages/eslint-config-refined/src/` と比較

## 調査結果

### 1. アーキテクチャ・プラグインの違い

| 領域 | picstash | eslint-config-refined | 備考 |
|------|----------|-----------------------|------|
| React | `eslint-plugin-react` + `eslint-plugin-react-hooks` | `eslint-plugin-react-x` | refined は新しい react-x に移行済み |
| Promise | `eslint-plugin-promise`（コミュニティ版） | `@mizunashi_mana/eslint-plugin-promise`（カスタムフォーク） | refined は ESLint v10 互換フォーク |
| Globals | `globals.browser` + `globals.commonjs` | `globals.node` | refined は Node.js 特化 |
| Storybook | `eslint-plugin-storybook` あり | なし | refined はスコープ外 |
| Playwright | `eslint-plugin-playwright` あり | なし | refined はスコープ外 |
| Config API | `eslint/config` の `defineConfig` | `eslint/config` の `defineConfig` | 同じ |

### 2. globals.config.ts の差分

| 項目 | picstash | refined |
|------|----------|---------|
| グローバル変数 | `globals.browser` + `globals.commonjs` | `globals.node` |
| デフォルト projectService | `false` | `false` |
| TS ファイルの projectService | `true` | `true` |
| TypeScript パーサー | `typescript-eslint` parser（暗黙） | `typescript-eslint` parser（明示） |

### 3. js.config.ts の差分

#### picstash にあって refined にないもの

| ルール | picstash の設定 | コメント |
|--------|----------------|----------|
| `no-restricted-globals` (browser) | `window`, `document`, `crypto`, `navigator` を制限（DI 推奨メッセージ付き） | picstash はブラウザ環境向け |
| storybook ファイルオーバーライド | `*.stories.{ts,tsx}` で `no-console`, `no-alert` を off | refined には storybook なし |

#### refined にあって picstash にないもの

| ルール | refined の設定 | コメント |
|--------|---------------|----------|
| `consistent-this` | `"that"` | refined で追加 |
| `no-restricted-globals` | `event`, `fdescribe` | 汎用的なグローバル制限 |

#### 設定値の違い

| ルール | picstash | refined | コメント |
|--------|----------|---------|----------|
| `max-lines` | 450 | 400 | refined がより厳格 |
| `max-lines`（テスト） | 900 | 900 | 同じ |
| `no-restricted-imports` | `../` を制限（`@` パス推奨） | `../` を制限（`@` パス推奨） | 同じ |

### 4. ts.config.ts の差分

#### picstash にあって refined にないもの

| ルール | picstash の設定 | 取り込み推奨度 |
|--------|----------------|---------------|
| `@typescript-eslint/no-explicit-any` | error（テストでは off） | 検討：recommendedTypeChecked に含まれる可能性 |
| `@typescript-eslint/no-unsafe-argument` | error（テストでは off） | 検討：recommendedTypeChecked に含まれる可能性 |
| `@typescript-eslint/no-unsafe-assignment` | error（テストでは off） | 検討：recommendedTypeChecked に含まれる可能性 |
| `@typescript-eslint/no-unsafe-call` | error（テストでは off） | 検討：recommendedTypeChecked に含まれる可能性 |
| `@typescript-eslint/no-unsafe-member-access` | error（テストでは off） | 検討：recommendedTypeChecked に含まれる可能性 |
| `@typescript-eslint/no-unsafe-return` | error（テストでは off） | 検討：recommendedTypeChecked に含まれる可能性 |
| `@typescript-eslint/no-unsafe-unary-minus` | error | 検討：recommendedTypeChecked に含まれる可能性 |
| テストでの `no-unsafe-*` 一括 off | `no-unsafe-assignment`, `no-unsafe-argument`, `no-unsafe-return`, `no-unsafe-call`, `no-unsafe-member-access` を off | 有用 |

#### refined にあって picstash にないもの

| ルール | refined の設定 | コメント |
|--------|---------------|----------|
| `@typescript-eslint/strict-void-return` | `[error, { allowReturnAny: false }]` | refined で追加された新ルール |
| `@typescript-eslint/related-getter-setter-pairs` | error | refined で追加 |

#### 設定値の違い

| ルール | picstash | refined | コメント |
|--------|----------|---------|----------|
| `return-await` | `always` | `in-try-catch` | 方針の違い。picstash は常に await、refined は try-catch 内のみ |
| `switch-exhaustiveness-check` | `allowDefaultCaseForExhaustiveSwitch: false` | 同 + `considerDefaultExhaustiveForUnions: true` | refined がより柔軟 |
| `naming-convention` (variable) | `camelCase, PascalCase, UPPER_CASE` | `camelCase, UPPER_CASE` | picstash は変数の PascalCase も許可 |
| テストオーバーライド対象ファイル | `*.{test,spec,stories}.{ts,tsx}` | `*.{test,spec,stories}.{ts,tsx}` | 同じ |
| テストでの `no-unsafe-type-assertion` | off | off | 同じ |

### 5. imports.config.ts の差分

| 項目 | picstash | refined | コメント |
|------|----------|---------|----------|
| import order の react 優先 | `react` を external の先頭に | なし | picstash は React プロジェクト特化 |
| その他のルール | ほぼ同一 | ほぼ同一 | |

### 6. node.config.ts の差分

#### picstash にあって refined にないもの

| ルール | picstash の設定 | 取り込み推奨度 |
|--------|----------------|---------------|
| `n/no-callback-literal` | error | 中：コールバックパターンの品質向上 |
| `n/no-exports-assign` | error | 高：ESM で exports 再代入を防止 |

#### refined にあって picstash にないもの

| ルール | refined の設定 | コメント |
|--------|---------------|----------|
| `n/prefer-node-protocol` | error | refined で明示的に追加（picstash は recommended に含まれる可能性） |
| エントリポイントの `n/hashbang` off | entrypointFiles で off | refined 独自のオーバーライド |
| エントリポイントの `n/no-process-exit` off | entrypointFiles で off | refined 独自のオーバーライド |

### 7. react.config.ts の差分

完全に異なるプラグインを使用：

| 項目 | picstash | refined |
|------|----------|---------|
| プラグイン | `eslint-plugin-react` + `eslint-plugin-react-hooks` | `eslint-plugin-react-x` |
| ルール体系 | `react/*` + `react-hooks/*` | `react-x/*` |
| ルール数 | 少数（prop-types off + exhaustive-deps） | 多数（20+ ルール明示） |
| React 19 対応 | `no-forward-ref` 等なし | `no-forward-ref`, `no-context-provider`, `no-use-context` あり |

refined の react-x 移行は正しい方向性。picstash からの追加取り込みは不要。

### 8. promise.config.ts の差分

| ルール | picstash | refined | コメント |
|--------|----------|---------|----------|
| `always-return` | ✓ (ignoreLastCallback) | ✓ (ignoreLastCallback) | 同じ |
| `no-promise-in-callback` | ✓ | ✓ | 同じ |
| `no-multiple-resolved` | なし | ✓ | refined で追加 |
| `prefer-await-to-then` | なし | ✓ | refined で追加 |
| `require-await` off | ✓ | ✓ | 同じ |
| ベース config | `flat/recommended` | `recommended`（カスタムフォーク） | |

### 9. picstash のみのファイル

| ファイル | 説明 | refined への取り込み |
|----------|------|---------------------|
| `playwright.config.ts` | E2E テスト用ルール | スコープ外（将来検討） |
| `storybook.config.ts` | Storybook 用ルール | スコープ外（将来検討） |

## 結論

### 取り込みを検討すべき差分

1. **`n/no-callback-literal`**: コールバックの第一引数が Error でない値を検出。品質向上に有用
2. **`n/no-exports-assign`**: ESM での `exports` 再代入防止。バグ防止に有用
3. **テストファイルでの `no-unsafe-*` 一括 off**: picstash のテストオーバーライドはより包括的（`no-unsafe-assignment`, `no-unsafe-argument`, `no-unsafe-return` も off）。refined のテストオーバーライドに追加を検討
4. **`naming-convention` の variable に PascalCase 追加**: React コンポーネントを変数に代入するケースで有用

### 意図的な差分（変更不要）

1. **globals**: refined は Node.js 特化のため `globals.node` で正しい
2. **React プラグイン**: refined の `react-x` 移行は正しい方向性
3. **Promise プラグイン**: refined のカスタムフォークで追加ルール（`no-multiple-resolved`, `prefer-await-to-then`）は改善
4. **`return-await`**: `in-try-catch` vs `always` は方針の違い。refined の設定は TypeScript の推奨に沿っている
5. **`max-lines: 400`**: より厳格で問題なし
6. **Storybook/Playwright**: 汎用 config としてスコープ外は適切

### 注意点

- picstash の `no-restricted-globals` でブラウザグローバル（`window`, `document` 等）を制限する仕組みは、React プロジェクト向けには有用だが、refined の現在のスコープでは不要
- picstash の `no-restricted-imports` で `../` を禁止する設定は両方に存在し、`@` パスの使用を推奨している

## 参考リンク

- [picstash eslint-config](https://github.com/mizunashi-mana/picstash/tree/main/packages/eslint-config/src)
- [eslint-config-refined](https://github.com/mizunashi-mana/eslint-config-refined/tree/main/packages/eslint-config-refined/src)
