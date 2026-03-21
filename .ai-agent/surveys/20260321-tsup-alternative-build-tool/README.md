# tsup 代替ビルドツール調査

## 調査の問い

- tsup の代替として、どのビルドツールが本プロジェクトに最適か？
- path alias サポートを含む要件を満たせるか？

## 背景

- tsup (egoist/tsup) の最終コミットは 2025-11-12。open issues 392件で開発が停滞している
- tsup の主要コントリビューター Kevin Deng が tsdown の開発に移行
- 本プロジェクトでは path alias を導入したいが、tsup での対応は限定的
- 現在の構成: ESM only, dts 生成, 2パッケージのモノレポ

## 調査方法

- Web 検索による技術動向・比較記事の収集
- 公式ドキュメントの確認
- GitHub API によるリポジトリ活動状況の確認

## 調査結果

### 候補の比較

| 項目 | tsdown | unbuild | tsc 直接利用 |
| --- | --- | --- | --- |
| **概要** | tsup の精神的後継。Rolldown ベース | unjs エコシステムのビルドツール。Rollup ベース | TypeScript コンパイラのみ |
| **GitHub Stars** | 3,705 | 2,727 | N/A |
| **最終リリース** | 2026-03-16 (v0.21.4) | 活発 (2026-03-15 push) | TypeScript に依存 |
| **メンテナンス** | 非常に活発（週次リリース） | 活発 | TypeScript チームが保守 |
| **ESM サポート** | ESM-first（デフォルト） | ESM/CJS 両対応 | ネイティブ |
| **DTS 生成** | 組み込み（isolated declarations） | mkdist 経由 | ネイティブ |
| **path alias** | Rolldown が tsconfig.json の paths を自動解決 | Rollup プラグインで対応 | ネイティブ（ただし出力には反映されない） |
| **tsup からの移行** | `npx tsdown-migrate` で自動移行可能 | 手動書き換え | 設定を一から構築 |
| **プラグイン** | Rolldown + Rollup + unplugin | Rollup プラグイン | なし |
| **パフォーマンス** | Rust ベースで高速 | JavaScript ベース | JavaScript ベース |
| **ライセンス** | MIT | MIT | Apache-2.0 |

### 詳細分析

#### tsdown（推奨）

tsup の精神的後継として設計されており、移行パスが最も明確。

**メリット:**
- tsup との設定互換性が高く、自動移行ツールあり
- Rolldown ベースで高パフォーマンス
- ESM-first 設計（本プロジェクトの ESM only 方針と合致）
- tsconfig.json の paths を Rolldown が自動解決（path alias サポート）
- DTS 生成が組み込み（isolated declarations 対応）
- 活発な開発（週次リリース、2026-03-16 時点で v0.21.4）
- monorepo 向け workspace モード搭載

**デメリット:**
- まだ v1.0 未到達（v0.21.x）
- tsup と完全互換ではない（一部オプション名の変更あり）
- stub mode 非対応（本プロジェクトでは不要）

**移行時の主な変更点:**
- `format` デフォルト: `'cjs'` → `'esm'`（本プロジェクトに有利）
- `clean` デフォルト: `false` → `true`（本プロジェクトの設定と一致）
- `dts` : package.json の `types` フィールドがあれば自動有効化
- `external`/`noExternal` → `deps.neverBundle`/`deps.alwaysBundle` に移動

#### unbuild

unjs エコシステムの成熟したビルドツール。

**メリット:**
- package.json から自動推論する設定レス設計
- stub mode 対応（開発時にリビルド不要）
- unjs エコシステムとの統合

**デメリット:**
- tsup からの移行パスが用意されていない
- path alias は Rollup プラグインで別途設定が必要
- 本プロジェクトの規模では over-engineering 気味

#### tsc 直接利用

バンドルせず TypeScript コンパイラのみで出力。

**メリット:**
- 依存ゼロ、最もシンプル
- path alias は TypeScript が理解するが、出力コードでは解決されない

**デメリット:**
- 出力コードの path alias 解決に別ツール（tsc-alias 等）が必要
- バンドル最適化なし
- 設定の柔軟性が低い

### 本プロジェクトへの適用

現在の tsup 設定は非常にシンプル:
```ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  tsconfig: 'tsconfig.build.json',
  dts: true,
  clean: true,
});
```

tsdown への移行後（想定）:
```ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  tsconfig: 'tsconfig.build.json',
  dts: true,
});
```

- `clean` はデフォルト `true` のため省略可能
- path alias は tsconfig.json の `paths` に定義すれば Rolldown が自動解決

## 結論

**tsdown を推奨。**

理由:
1. tsup からの移行が最も容易（自動移行ツールあり、設定互換性高い）
2. path alias を tsconfig.json の paths 経由で自動解決（追加設定不要）
3. ESM-first 設計が本プロジェクトの方針と合致
4. 活発にメンテナンスされており、Rolldown/Vite エコシステムの一部として将来性がある
5. v1.0 未到達だが、実用上十分な安定性（多くのプロジェクトが移行済み）

**注意点・リスク:**
- v1.0 前のため、マイナーバージョンで breaking change の可能性あり
- isolated declarations を有効にする必要がある場合がある（DTS 生成方式による）

## 参考リンク

- [tsdown 公式ドキュメント](https://tsdown.dev/guide/)
- [tsdown FAQ](https://tsdown.dev/guide/faq)
- [tsup から tsdown への移行ガイド](https://tsdown.dev/guide/migrate-from-tsup)
- [Switching from tsup to tsdown (Alan Norbauer)](https://alan.norbauer.com/articles/tsdown-bundler/)
- [tsdown GitHub](https://github.com/rolldown/tsdown)
- [tsup GitHub](https://github.com/egoist/tsup)
- [unbuild GitHub](https://github.com/unjs/unbuild)
- [Rolldown tsconfig オプション](https://rolldown.rs/reference/inputoptions.tsconfig)
