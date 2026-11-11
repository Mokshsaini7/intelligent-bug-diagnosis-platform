```ts
import { useCallback, useEffect, useState } from "react";

import {
  healthService,
  type HealthStatus,
} from "../services/healthService";

interface UseHealthOptions {
  enabled?: boolean;
  intervalMs?: number;
}

interface HealthState {
  status: HealthStatus;
  databaseReady: boolean | null;
  isChecking: boolean;
  lastChecked: Date | null;
  error: string | null;
}

const INITIAL_STATE: HealthState = {
  status: "unknown",
  databaseReady: null,
  isChecking: false,
  lastChecked: null,
  error: null,
};

export function useHealth(options: UseHealthOptions = {}) {
  const {
    enabled = true,
    intervalMs = 30_000,
  } = options;

  const [health, setHealth] = useState<HealthState>(INITIAL_STATE);

  const checkHealth = useCallback(async () => {
    if (!enabled) return;

    setHealth((current) => ({
      ...current,
      isChecking: true,
      error: null,
    }));

    try {
      const [healthResult, readinessResult] = await Promise.allSettled([
        healthService.checkHealth(),
        healthService.checkReadiness(),
      ]);

      const backendHealthy =
        healthResult.status === "fulfilled" &&
        healthResult.value.status.toLowerCase() === "healthy";

      const databaseReady =
        readinessResult.status === "fulfilled" &&
        readinessResult.value.status.toLowerCase() === "ready";

      const backendReachable = healthResult.status === "fulfilled";

      setHealth({
        status: backendHealthy ? "healthy" : "unhealthy",
        databaseReady: readinessResult.status === "fulfilled"
          ? databaseReady
          : null,
        isChecking: false,
        lastChecked: new Date(),
        error: backendReachable
          ? null
          : "Backend health endpoint is unavailable.",
      });
    } catch {
      setHealth({
        status: "unhealthy",
        databaseReady: null,
        isChecking: false,
        lastChecked: new Date(),
        error: "Unable to check backend health.",
      });
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    void checkHealth();

    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [enabled, intervalMs, checkHealth]);

  return {
    ...health,
    refresh: checkHealth,
  };
}
```
