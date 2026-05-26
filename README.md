# Rails × React × OpenAPI — rspec-openapi ハンズオン

Rails API のテストから OpenAPI スペックを自動生成し、TypeScript の型として React フロントエンドで利用するサンプルプロジェクトです。

## 構成

```
react_rails_opneapi/
├── backend/   Rails API (SQLite3)
├── frontend/  React + Vite + openapi-fetch
└── doc/       ハンズオンガイド HTML
```

## 技術スタック

| 層 | 技術 |
|---|---|
| バックエンド | Rails 8 API mode / SQLite3 / rspec-openapi |
| フロントエンド | React 19 / TypeScript / openapi-fetch / Vite |
| OpenAPI生成 | rspec-openapi（テスト実行から自動生成） |
| 型生成 | openapi-typescript |

---

## セットアップ手順

### 1. バックエンド

```bash
cd backend
bundle install
rails db:create db:migrate
RAILS_ENV=test rails db:migrate
```

### 2. テスト実行（通常）

```bash
bundle exec rspec
```

### 3. OpenAPI スペック生成

```bash
# OPENAPI=1 をつけると doc/openapi.yaml が自動生成される
OPENAPI=1 bundle exec rspec
```

### 4. フロントエンド

```bash
cd frontend
bun install   # または npm install

# OpenAPI スキーマから TypeScript 型を生成
bun run generate:api   # → src/openapi_schema/api_schema.ts

# 開発サーバー起動
bun run dev
```

---

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/v1/tasks` | 一覧取得（`?status=pending` でフィルタ） |
| GET | `/api/v1/tasks/:id` | 詳細取得 |
| POST | `/api/v1/tasks` | 作成 |
| PATCH | `/api/v1/tasks/:id` | 更新 |
| DELETE | `/api/v1/tasks/:id` | 削除 |

リクエストボディは `task` キーでネストして送信します。

```json
{ "task": { "title": "タスク名", "status": "pending" } }
```

ステータスの値: `pending` / `in_progress` / `completed`

---

## フロントエンドの型の使い方

`src/openapi_schema/api_schema.ts` が openapi-typescript によって自動生成されます。  
`src/types.ts` でアプリ用の型エイリアスを定義し、各コンポーネントから参照しています。

```ts
// src/api/client.ts
import createClient from "openapi-fetch";
import type { paths } from "../openapi_schema/api_schema";

export const api = createClient<paths>({ baseUrl: "http://localhost:3000" });
```

```ts
// 型安全な API 呼び出し例
const { data } = await api.GET("/api/v1/tasks", {
  params: { query: { status: "pending" } },
});
// data は { id, title, description, status, created_at, updated_at }[] と型推論される
```

---

## ガイドドキュメント

`doc/rails-react-openapi-rspec-openapi-guide.html` をブラウザで開くと、セットアップから CI 整合性チェック、スキーマの components 分割、テストリファクタリングまでのハンズオンガイドを参照できます。
