```typescript
export type SeverityLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type SubmissionStatus =
  | "submitted"
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface BugSubmissionCreate {
  title: string;
  description: string;
  programming_language?: string | null;
  framework?: string | null;
  environment?: string | null;
  severity: SeverityLevel;
  steps_to_reproduce?: string | null;
  expected_behavior?: string | null;
  actual_behavior?: string | null;
  stack_trace?: string | null;
  error_logs?: string | null;
}

export interface BugSubmission {
  id: string;
  title: string;
  description: string;
  programming_language: string | null;
  framework: string | null;
  environment: string | null;
  severity: SeverityLevel;
  steps_to_reproduce: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  stack_trace: string | null;
  error_logs: string | null;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
}

export interface BugSubmissionSummary {
  id: string;
  title: string;
  programming_language: string | null;
  severity: SeverityLevel;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface SubmissionFilters {
  page?: number;
  page_size?: number;
  severity?: SeverityLevel;
  status?: SubmissionStatus;
  search?: string;
}
```
