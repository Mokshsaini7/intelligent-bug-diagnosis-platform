```ts
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""));

export const bugSubmissionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must contain at least 5 characters.")
    .max(200, "Title cannot exceed 200 characters."),

  description: z
    .string()
    .trim()
    .min(20, "Description must contain at least 20 characters.")
    .max(10_000, "Description cannot exceed 10,000 characters."),

  programming_language: z
    .string()
    .trim()
    .max(100, "Programming language cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  framework: z
    .string()
    .trim()
    .max(100, "Framework cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  environment: optionalText,

  severity: z.enum(["low", "medium", "high", "critical"]),

  steps_to_reproduce: optionalText,

  expected_behavior: optionalText,

  actual_behavior: optionalText,

  stack_trace: z
    .string()
    .max(20_000, "Stack trace cannot exceed 20,000 characters.")
    .optional()
    .or(z.literal("")),

  error_logs: z
    .string()
    .max(20_000, "Error logs cannot exceed 20,000 characters.")
    .optional()
    .or(z.literal("")),
});

export const submissionFiltersSchema = z.object({
  search: z.string().optional(),
  severity: z
    .enum(["", "low", "medium", "high", "critical"])
    .optional(),
  status: z
    .enum(["", "submitted", "pending", "processing", "completed", "failed"])
    .optional(),
  page: z.number().int().min(1).default(1),
  page_size: z.number().int().min(1).max(100).default(10),
});

export type BugSubmissionFormValues = z.infer<
  typeof bugSubmissionSchema
>;

export type SubmissionFilterValues = z.infer<
  typeof submissionFiltersSchema
>;
```
