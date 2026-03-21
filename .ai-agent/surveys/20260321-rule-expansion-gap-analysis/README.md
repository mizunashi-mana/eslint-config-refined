# ルール拡充ギャップ分析

## 調査の問い

- eslint-config-refined に不足しているルールは何か？
- eslint-config-love や typescript-eslint の各プリセットと比較して、追加すべきルールはどれか？
- 既存ルールの設定値に見直しが必要な箇所はあるか？

## 背景

フェーズ 5「ルール拡充」の計画に基づき、eslint-config-love のルール設定を参考にした網羅的なレビューと、typescript-eslint / @eslint/js の各 recommended 設定との差分分析を行う。

## 調査方法

- eslint-config-love v151.0.0（GitHub ソース）のルール一覧を取得
- eslint-config-standard v17.1.0（GitHub ソース）のルール一覧を取得
- typescript-eslint の各プリセット（recommended, recommendedTypeChecked, strict, strictTypeChecked, stylistic, stylisticTypeChecked）のルール一覧を取得
- @eslint/js recommended のルール一覧を取得
- eslint-config-refined の現在の設定と比較

## 参照した設定の概要

### eslint-config-love v151.0.0

- ESLint 対応: ^9.35.0（v10 未対応）
- ルール総数: 236 ルール（core 105, @typescript-eslint 107, import 7, promise 4, n 7, comments 6）
- 使用プラグイン: typescript-eslint, eslint-plugin-import, eslint-plugin-promise, eslint-plugin-n, @eslint-community/eslint-plugin-eslint-comments
- フォーマットルールなし（Prettier 等に委譲）

### eslint-config-standard v17.1.0

- ESLint 対応: ^8.0.1（レガシー config 形式）
- ルール総数: 約 130 ルール（core + import 6 + n 7 + promise 1）
- 使用プラグイン: eslint-plugin-import, eslint-plugin-n, eslint-plugin-promise
- JavaScript 専用（TypeScript ルールなし）
- フォーマットルール多数（セミコロンなし、2スペースインデント等）
- eslint-config-love は eslint-config-standard の TypeScript 拡張版（旧 eslint-config-standard-with-typescript）

## 調査結果

### 1. 未導入ルール（eslint-config-love にあり、当プロジェクトにないもの）

#### 1.1 Core ESLint ルール

| ルール | eslint-config-love の設定 | 推奨度 | 備考 |
|--------|---------------------------|--------|------|
| `arrow-body-style` | `['error', 'as-needed', { requireReturnForObjectLiteral: false }]` | ★★☆ | 好みが分かれる。省略可能な場合に `{}` と `return` を省く |
| `no-await-in-loop` | `['error']` | ★★★ | ループ内の await を検出。`Promise.all` の利用を促す |
| `no-negated-condition` | `['error']` | ★★☆ | `if (!x)` の else 節がある場合に反転を推奨 |
| `no-useless-assignment` | `['error']` | ★★★ | 使われない値への代入を検出。@eslint/js recommended にも含まれる |
| `prefer-named-capture-group` | `['error']` | ★★☆ | 正規表現の名前付きキャプチャを強制 |
| `preserve-caught-error` | `['error', { requireCatchParameter: true }]` | ★★★ | catch のエラーを握りつぶさない。ESLint v10 の新ルール |
| `require-atomic-updates` | `['error', { allowProperties: false }]` | ★☆☆ | 誤検出が多いことで知られる |
| `require-unicode-regexp` | `['error', { requireFlag: 'v' }]` | ★★☆ | 正規表現に `v` フラグを強制 |
| `strict` | `['error', 'safe']` | ★☆☆ | ESM では不要（TypeScript + ESM 環境では意味が薄い） |

#### 1.2 @typescript-eslint ルール

| ルール | eslint-config-love の設定 | 推奨度 | 備考 |
|--------|---------------------------|--------|------|
| `class-methods-use-this` | `['error', { ... }]` | ★★☆ | クラスメソッドで `this` を使わない場合に警告 |
| `explicit-function-return-type` | `['error', { allowExpressions: true, ... }]` | ★★★ | 関数の戻り値型を明示的に要求。型安全性向上 |
| `init-declarations` | `['error', 'always']` | ★☆☆ | 変数宣言時に初期化を強制。TypeScript では型で担保されるため優先度低 |
| `no-magic-numbers` | `['error', { detectObjects: true, ignoreEnums: true, ... }]` | ★☆☆ | マジックナンバーを禁止。誤検出が多く調整が大変 |
| `no-unnecessary-type-parameters` | `['error']` | ★★★ | 不要な型パラメータを検出。strictTypeChecked に含まれる |
| `prefer-destructuring` | `['error', { array: true, object: true }, { enforceForRenamedProperties: true }]` | ★★☆ | 分割代入を推奨 |
| `strict-void-return` | `['error', { allowReturnAny: false }]` | ★★☆ | void を返す関数で値を返さないことを強制。比較的新しいルール |

#### 1.3 Import ルール

| ルール | eslint-config-love の設定 | 推奨度 | 備考 |
|--------|---------------------------|--------|------|
| `import/enforce-node-protocol-usage` | `['error', 'always']` | ★★★ | `node:` プロトコルの使用を強制（eslint-plugin-import の機能。import-x での対応要確認） |

### 2. 設定値の差分（両方にあるが設定が異なるもの）

| ルール | eslint-config-refined | eslint-config-love | 判断 |
|--------|----------------------|---------------------|------|
| `complexity` | max: 20 | max: 10 | **検討**: 10 は厳しすぎる可能性。現状維持推奨 |
| `max-lines` | max: 400 | max: 450 | 微差。現状維持 |
| `no-param-reassign` | `'error'`（props なし） | `['error', { props: true }]` | **検討**: props: true はオブジェクトのプロパティ再代入も禁止 |
| `no-return-assign` | `'always'` | `'except-parens'` | 当プロジェクトの方が厳格。現状維持 |
| `no-sequences` | `{ allowInParentheses: false }` | デフォルト | 当プロジェクトの方が厳格。現状維持 |
| `@typescript-eslint/no-confusing-void-expression` | `{ ignoreArrowShorthand: true, ignoreVoidOperator: true }` | 両方 false | **検討**: 当プロジェクトの方が緩い |
| `@typescript-eslint/no-empty-function` | `{ allow: ['arrowFunctions', 'functions', 'methods'] }` | `{ allow: [] }` | **検討**: love の方が厳格 |
| `@typescript-eslint/no-unused-vars` | パターンベース（`^_`） | `{ args: 'none', caughtErrors: 'none', ignoreRestSiblings: true }` | アプローチが異なる。当プロジェクトの方が厳格 |
| `@typescript-eslint/require-await` | `'off'` | `'error'` | **検討**: async 関数内に await がない場合に警告 |
| `@typescript-eslint/return-await` | `'in-try-catch'` | `'always'` | **検討**: love は常に return await を要求 |
| `@typescript-eslint/strict-boolean-expressions` | `{ allowNullableObject: true }` | すべて false | **検討**: love の方が厳格 |
| `@typescript-eslint/require-array-sort-compare` | デフォルト | `{ ignoreStringArrays: true }` | **検討**: love の方が緩い（文字列配列は比較関数不要） |
| `@typescript-eslint/consistent-type-definitions` | `'off'` | `['error', 'interface']` | 意図的に off にしている（interface/type の選択を自由に） |
| `@typescript-eslint/naming-convention` | 詳細な設定あり | `variableLike` のみ | 当プロジェクトの方が詳細。現状維持 |
| `object-shorthand` | `'error'` | `'warn'` | 当プロジェクトの方が厳格。現状維持 |

### 3. typescript-eslint プリセットとの差分

当プロジェクトは `recommendedTypeChecked` をベースに、`strictTypeChecked` と `stylisticTypeChecked` のルールをほぼ全てカバーしている。

**strictTypeChecked で当プロジェクトに不足しているルール:**

| ルール | 備考 |
|--------|------|
| `@typescript-eslint/no-unnecessary-type-parameters` | 不要な型パラメータを検出 |

上記以外の strictTypeChecked / stylisticTypeChecked ルールは全て導入済み。

### 4. eslint-config-standard との差分

eslint-config-standard は JavaScript 専用で、フォーマットルールが中心。当プロジェクトは @stylistic でフォーマットを管理しているため、フォーマットルールは比較対象外。

eslint-config-standard にあり、当プロジェクトにない非フォーマットルール:

| ルール | standard の設定 | 判断 |
|--------|----------------|------|
| `no-undef-init` | `'error'` | ★★☆ 初期化不要な `undefined` を検出。`let x = undefined` → `let x` |
| `no-mixed-operators` | `['error', { groups: [...], allowSamePrecedence: true }]` | ★☆☆ 演算子の混在を禁止。TypeScript の型チェックで多くは担保される |
| `eqeqeq` | `{ null: 'ignore' }` | 差分のみ。当プロジェクトは `'always'`（null 比較も厳格）。現状維持 |
| `no-void` | `'error'`（allowAsStatement なし） | 差分のみ。当プロジェクトは `{ allowAsStatement: true }`。現状維持 |

standard のルールの大半は当プロジェクトでカバー済み。eslint-config-love が standard の上位互換的な位置づけであるため、love との差分分析で実質的にカバーされている。

### 5. @eslint/js recommended との差分

当プロジェクトは `eslint.configs.recommended` を extends しているため、recommended ルールは全て含まれている。ただし ESLint v10 で新たに追加された以下のルールについて確認が必要:

| ルール | 備考 |
|--------|------|
| `no-useless-assignment` | recommended に追加済み（extends で自動有効化） |
| `preserve-caught-error` | ESLint v10 新ルール。recommended に含まれるか要確認 |

## 結論

### 追加を推奨するルール（★★★）

| ルール | 理由 |
|--------|------|
| `no-await-in-loop` | パフォーマンス問題の検出に有用 |
| `no-useless-assignment` | デッドコード検出。recommended にも含まれる |
| `preserve-caught-error` | エラー握りつぶし防止。ESLint v10 の新ルール |
| `@typescript-eslint/explicit-function-return-type` | 型安全性の大幅向上。eslint-config-love の特徴的ルール |
| `@typescript-eslint/no-unnecessary-type-parameters` | strictTypeChecked の唯一の未導入ルール |
| `import-x/enforce-node-protocol-usage`（要確認） | `node:` プロトコルの統一。import-x での対応要確認 |

### 追加を検討するルール（★★☆）

| ルール | 検討ポイント |
|--------|-------------|
| `arrow-body-style` | コードスタイルの好み次第 |
| `no-negated-condition` | 可読性向上だが好みが分かれる |
| `prefer-named-capture-group` | 正規表現の可読性向上 |
| `require-unicode-regexp` | Unicode 対応の強制 |
| `@typescript-eslint/class-methods-use-this` | クラス設計の品質向上 |
| `@typescript-eslint/prefer-destructuring` | コードスタイルの好み次第 |
| `@typescript-eslint/strict-void-return` | 型安全性向上だが比較的新しいルール |

### 設定値の見直しを検討するルール

| ルール | 変更案 | 検討ポイント |
|--------|--------|-------------|
| `no-param-reassign` | `{ props: true }` を追加 | イミュータビリティ強化 |
| `@typescript-eslint/require-await` | `'off'` → `'error'` | 不要な async の検出 |
| `@typescript-eslint/require-array-sort-compare` | `{ ignoreStringArrays: true }` | 文字列配列の比較関数省略を許可 |

### 追加しないことを推奨するルール

| ルール | 理由 |
|--------|------|
| `require-atomic-updates` | 誤検出が多いことで知られる |
| `strict` | TypeScript + ESM 環境では不要 |
| `@typescript-eslint/init-declarations` | TypeScript の型システムで担保される |
| `@typescript-eslint/no-magic-numbers` | 誤検出が多く、調整コストが高い |

## 次のアクション

1. 上記の推奨ルール・検討ルールについてユーザーと方針を合意
2. `/autodev-start-new-task` で実装タスクを作成
3. ルールの追加・設定値変更を実装
4. スナップショットテストの更新

## 参考リンク

- [eslint-config-love](https://github.com/mightyiam/eslint-config-love) - v151.0.0
- [eslint-config-standard](https://github.com/standard/eslint-config-standard) - v17.1.0
- [typescript-eslint configs](https://typescript-eslint.io/users/configs/) - recommended / strict / stylistic 各プリセット
- [@eslint/js](https://github.com/eslint/eslint/tree/main/packages/js) - ESLint コアルール
