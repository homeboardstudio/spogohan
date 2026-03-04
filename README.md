# アスメシ v0.7.3

スポーツキッズの「今日なに作ろう？」を解決する献立提案アプリ。

## ローカルで動かす

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 が自動で開きます。

## Vercel にデプロイ（最速手順）

### 方法A: Vercel CLI（推奨）

```bash
# 1. Vercel CLI をインストール（初回のみ）
npm i -g vercel

# 2. デプロイ（初回はプロジェクト設定を聞かれる → すべてデフォルトでOK）
vercel

# 3. 本番デプロイ
vercel --prod
```

これだけで `https://asumeshi-xxx.vercel.app` のようなURLが発行されます。

### 方法B: GitHub連携

1. このフォルダを GitHub リポジトリに push
2. [vercel.com](https://vercel.com) にログイン → 「Add New Project」
3. GitHub リポジトリを選択 → 「Deploy」

以降、`main` ブランチに push するたびに自動デプロイされます。

### カスタムドメイン設定

1. Vercel ダッシュボード → Settings → Domains
2. `asumeshi.com` 等を追加
3. ドメインのDNSにVercelが表示するCNAMEレコードを設定

## 本番前のTODO

- [ ] OGP画像（ogp.png 1200×630px）を作成し、index.html のコメントアウトを解除
- [ ] Googleフォント読み込みを `display=swap` 済み（対応済み）
- [ ] favicon を正式なものに差し替え
- [ ] Google Analytics or Plausible を導入

## 技術構成

- **Vite** — ビルドツール
- **React 18** — UI
- **Vercel** — ホスティング
- **フォント** — Zen Maru Gothic（Google Fonts）
