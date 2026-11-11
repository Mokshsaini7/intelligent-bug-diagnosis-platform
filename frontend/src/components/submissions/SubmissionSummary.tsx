```tsx
import {
  CalendarDays,
  Code2,
  FileText,
  Layers3,
} from "lucide-react";

import type { BugSubmission } from "../../types/submission";

import SeverityBadge from "../ui/SeverityBadge";
import StatusBadge from "../ui/StatusBadge";
import DateDisplay from "../ui/DateDisplay";
import SectionCard from "../ui/SectionCard";

interface SubmissionSummaryProps {
  submission: BugSubmission;
  className?: string;
}

function SubmissionSummary({
  submission,
  className = "",
}: SubmissionSummaryProps) {
  return (
    <SectionCard
      title="Submission Summary"
      description="Overview of the reported issue."
      className={className}
    >
      <div className="space-y-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Bug Title
          </p>
          <h3 className="mt-2 text-lg font-semibold text-foreground">
            {submission.title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SeverityBadge severity={submission.severity} />
          <StatusBadge status={submission.status} />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Description
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
            {submission.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarDays
              size={18}
              className="mt-0.5 text-muted"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-muted">Submitted</p>
              <div className="mt-1 text-sm text-foreground">
                <DateDisplay date={submission.created_at} format="medium" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Code2
              size={18}
              className="mt-0.5 text-muted"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-muted">Language</p>
              <p className="mt-1 text-sm text-foreground">
                {submission.programming_language || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Layers3
              size={18}
              className="mt-0.5 text-muted"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-muted">Framework</p>
              <p className="mt-1 text-sm text-foreground">
                {submission.framework || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText
              size={18}
              className="mt-0.5 text-muted"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-muted">Submission ID</p>
              <p className="mt-1 break-all font-mono text-xs text-foreground">
                {submission.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default SubmissionSummary;
```
