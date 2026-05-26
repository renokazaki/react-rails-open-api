import type { paths } from "./openapi_schema/api_schema";

export type Task =
  paths["/api/v1/tasks"]["get"]["responses"][200]["content"]["application/json"][number];

export type TaskStatus = "pending" | "in_progress" | "completed";

export type CreateTaskBody =
  NonNullable<paths["/api/v1/tasks"]["post"]["requestBody"]>["content"]["application/json"];

export type UpdateTaskBody =
  NonNullable<paths["/api/v1/tasks/{id}"]["patch"]["requestBody"]>["content"]["application/json"];
