```typescript
import { api } from "../lib/api";

import type {
  APIResponse,
  BugSubmission,
  BugSubmissionCreate,
  BugSubmissionSummary,
  PaginatedResponse,
  SubmissionFilters,
} from "../types/submission";

export const submissionService = {
  /**
   * Create a new bug submission.
   */
  async create(
    payload: BugSubmissionCreate,
  ): Promise<BugSubmission> {
    const response = await api.post<
      APIResponse<BugSubmission>
    >("/submissions", payload);

    if (!response.data.data) {
      throw new Error("The server returned an empty submission.");
    }

    return response.data.data;
  },

  /**
   * Retrieve a single bug submission.
   */
  async getById(id: string): Promise<BugSubmission> {
    const response = await api.get<
      APIResponse<BugSubmission>
    >(`/submissions/${encodeURIComponent(id)}`);

    if (!response.data.data) {
      throw new Error("The server returned an empty submission.");
    }

    return response.data.data;
  },

  /**
   * Retrieve paginated bug submissions.
   */
  async list(
    filters: SubmissionFilters = {},
  ): Promise<PaginatedResponse<BugSubmissionSummary>> {
    const response = await api.get<
      PaginatedResponse<BugSubmissionSummary>
    >("/submissions", {
      params: filters,
    });

    return response.data;
  },
};
```
