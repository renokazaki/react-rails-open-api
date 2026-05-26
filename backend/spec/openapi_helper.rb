require "rspec/openapi"

RSpec::OpenAPI.path = "doc/openapi.yaml"
RSpec::OpenAPI.title = "Task Manager API"
RSpec::OpenAPI.info = {
  version: "1.0.0",
  description: "タスク管理アプリケーションの API"
}
RSpec::OpenAPI.servers = [
  { url: "http://localhost:3000", description: "開発環境" }
]
RSpec::OpenAPI.example_types = [:request]
RSpec::OpenAPI.tags_builder = ->(example) {
  path = example.metadata[:request_path] || ""
  [path.split("/").reject(&:empty?).last&.capitalize].compact
}
