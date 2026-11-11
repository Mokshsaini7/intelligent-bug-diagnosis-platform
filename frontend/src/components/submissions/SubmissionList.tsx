```tsx
import { Eye, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";

import type { BugSubmissionSummary } from "../../types/submission";

import SeverityBadge from "../ui/SeverityBadge";
import StatusBadge from "../ui/StatusBadge";
import DateDisplay from "../ui/DateDisplay";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

interface SubmissionListProps {
  submissions: BugSubmissionSummary[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

function SubmissionList({
  submissions,
  isLoading = false,
  error,
  onRetry,
  className = "",
}: SubmissionListProps) {
  if (isLoading) {
    return <LoadingState label="Loading bug reports..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={FileSearch}
        title="No bug reports found"
        description="Submitted bug reports will appear here."
      />
    );
  }

  return (
    <div
      className={[
        "overflow-hidden rounded-xl border border-border bg-surface",
        className,
      ].join(" ")}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-border bg-elevated/60">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Bug Report
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Severity
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Status
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Submitted
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {submissions.map((submission) => (
              <tr
                key={submission.id}
                className="transition-colors hover:bg-elevated/40"
              >
                <td className="max-w-sm px-5 py-4">
                  <Link
                    to={`/reports/${submission.id}`}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {submission.title}
                  </Link>

                  <p className="mt-1 truncate text-xs text-muted">
                    {submission.description}
                  </p>

                  {submission.programming_language && (
                    <p className="mt-2 text-xs text-muted">
                      {submission.programming_language}
                      {submission.framework
                        ? ` · ${submission.framework}`
                        : ""}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <SeverityBadge severity={submission.severity} />
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={submission.status} />
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
                  <DateDisplay
                    date={submission.created_at}
                    format="medium"
                  />
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/reports/${submission.id}`}
                    aria-label={`View ${submission.title}`}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border px-5 py-3">
        <p className="text-xs text-muted">
          Showing {submissions.length} bug report
          {submissions.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

export default SubmissionList;
```
