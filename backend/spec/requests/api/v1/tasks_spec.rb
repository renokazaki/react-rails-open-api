require "rails_helper"

RSpec.describe "Tasks API", type: :request do
  let(:json) { JSON.parse(response.body) }

  # ── 一覧取得 ──
  describe "GET /api/v1/tasks" do
    it "returns all tasks" do
      Task.create!(title: "タスク1", description: "詳細1", status: "pending")
      Task.create!(title: "タスク2", description: "詳細2", status: "completed")

      get "/api/v1/tasks"

      expect(response).to have_http_status(200)
      expect(json.length).to eq(2)
      expect(json[0]).to have_key("id")
      expect(json[0]).to have_key("title")
      expect(json[0]).to have_key("status")
      expect(json[0]).to have_key("created_at")
    end

    it "filters by status" do
      Task.create!(title: "やること", status: "pending")
      Task.create!(title: "終わった", status: "completed")

      get "/api/v1/tasks", params: { status: "pending" }

      expect(response).to have_http_status(200)
      expect(json.length).to eq(1)
      expect(json[0]["status"]).to eq("pending")
    end

    it "returns empty array when no tasks exist" do
      get "/api/v1/tasks"

      expect(response).to have_http_status(200)
      expect(json).to eq([])
    end
  end

  # ── 詳細取得 ──
  describe "GET /api/v1/tasks/:id" do
    it "returns a task" do
      task = Task.create!(title: "テスト", description: "メモ", status: "in_progress")

      get "/api/v1/tasks/#{task.id}"

      expect(response).to have_http_status(200)
      expect(json["id"]).to eq(task.id)
      expect(json["title"]).to eq("テスト")
      expect(json["description"]).to eq("メモ")
      expect(json["status"]).to eq("in_progress")
    end

    it "returns 404 for not found" do
      get "/api/v1/tasks/999999"

      expect(response).to have_http_status(404)
      expect(json).to have_key("error")
    end
  end

  # ── 作成 ──
  describe "POST /api/v1/tasks" do
    it "creates a task" do
      post "/api/v1/tasks",
        params: { task: { title: "新しいタスク", description: "メモ" } }.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response).to have_http_status(201)
      expect(json["title"]).to eq("新しいタスク")
      expect(json["description"]).to eq("メモ")
      expect(json["status"]).to eq("pending")
    end

    it "creates a task with status" do
      post "/api/v1/tasks",
        params: { task: { title: "進行中タスク", status: "in_progress" } }.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response).to have_http_status(201)
      expect(json["status"]).to eq("in_progress")
    end

    it "returns 422 for missing title" do
      post "/api/v1/tasks",
        params: { task: { title: "" } }.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response).to have_http_status(422)
      expect(json).to have_key("errors")
    end

    it "returns 422 for invalid status" do
      post "/api/v1/tasks",
        params: { task: { title: "タスク", status: "invalid_status" } }.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response).to have_http_status(422)
      expect(json).to have_key("errors")
    end
  end

  # ── 更新 ──
  describe "PATCH /api/v1/tasks/:id" do
    it "updates a task" do
      task = Task.create!(title: "元のタイトル", description: "元の説明", status: "pending")

      patch "/api/v1/tasks/#{task.id}",
        params: { task: { title: "更新後", status: "in_progress" } }.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response).to have_http_status(200)
      expect(json["title"]).to eq("更新後")
      expect(json["status"]).to eq("in_progress")
      expect(json["description"]).to eq("元の説明")
    end

    it "returns 422 for invalid update" do
      task = Task.create!(title: "タスク")

      patch "/api/v1/tasks/#{task.id}",
        params: { task: { title: "", status: "pending" } }.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response).to have_http_status(422)
      expect(json).to have_key("errors")
    end

    it "returns 404 for not found" do
      patch "/api/v1/tasks/999999",
        params: { task: { title: "更新", status: "pending" } }.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response).to have_http_status(404)
    end
  end

  # ── 削除 ──
  describe "DELETE /api/v1/tasks/:id" do
    it "deletes a task" do
      task = Task.create!(title: "削除対象")

      delete "/api/v1/tasks/#{task.id}"

      expect(response).to have_http_status(204)
      expect(Task.find_by(id: task.id)).to be_nil
    end

    it "returns 404 for not found" do
      delete "/api/v1/tasks/999999"

      expect(response).to have_http_status(404)
    end
  end
end
