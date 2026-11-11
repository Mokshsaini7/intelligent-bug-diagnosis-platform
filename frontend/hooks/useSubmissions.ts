```ts
import { useCallback, useEffect, useState } from "react";

import { submissionService } from "../services/submissionService";

import type {
  BugSubmissionSummary,
  PaginationMeta,
  SubmissionFilters,
} from "../types/submission";

interface UseSubmissionsOptions {
  initialFilters?: Partial<SubmissionFilters>;
  enabled?: boolean;
}

export function useSubmissions(options: UseSubmissionsOptions = {}) {
  const { initialFilters = {}, enabled = true } = options;

  const [submissions, setSubmissions] = useState<BugSubmissionSummary[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const [filters, setFilters] = useState<SubmissionFilters>({
    search: "",
    severity: "",
    status: "",
    page: 1,
    page_size: 10,
    ...initialFilters,
  });

  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await submissionService.list(filters);

      setSubmissions(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve bug reports.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [enabled, filters]);

  useEffect(() => {
    void fetchSubmissions();
  }, [fetchSubmissions]);

  const updateFilters = useCallback(
    (updates: Partial<SubmissionFilters>) => {
      setFilters((current) => ({
        ...current,
        ...updates,
        page: updates.page ?? 1,
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      severity: "",
      status: "",
      page: 1,
      page_size: 10,
    });
  }, []);

  return {
    submissions,
    pagination,
    filters,
    isLoading,
    error,
    setFilters,
    updateFilters,
    resetFilters,
    refresh: fetchSubmissions,
  };
}
```
