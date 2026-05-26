import createClient from "openapi-fetch";
import type { paths } from "../openapi_schema/api_schema";

export const api = createClient<paths>({
  baseUrl: "http://localhost:3000",
});
