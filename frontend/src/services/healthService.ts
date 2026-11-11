```ts
import axios from "axios";

export type HealthStatus = "healthy" | "unhealthy" | "unknown";

export interface HealthResponse {
  status: string;
  application?: string;
  version?: string;
}

export interface ReadinessResponse {
  status: string;
  database?: string;
}

const API_ROOT =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:8000";

const healthClient = axios.create({
  baseURL: API_ROOT,
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

export const healthService = {
  async checkHealth(): Promise<HealthResponse> {
    const response = await healthClient.get<HealthResponse>("/health");
    return response.data;
  },

  async checkReadiness(): Promise<ReadinessResponse> {
    const response = await healthClient.get<ReadinessResponse>("/ready");
    return response.data;
  },

  async getStatus(): Promise<HealthStatus> {
    try {
      const result = await this.checkHealth();

      return result.status.toLowerCase() === "healthy"
        ? "healthy"
        : "unhealthy";
    } catch {
      return "unhealthy";
    }
  },
};
```
