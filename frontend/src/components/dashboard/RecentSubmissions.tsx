```tsx
import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

import type { BugSubmissionSummary } from "../../types/submission";

import SectionCard from "../ui/SectionCard";
import SubmissionList from "../submissions/SubmissionList";

interface RecentSubmissionsProps {
  submissions: BugSubmissionSummary[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  limit?: number;
  className?: string;
}

function RecentSubmissions({
  submissions,
  isLoading = false,
  error,
  onRetry,
  limit = 5,
  className = "",
}: RecentSubmissionsProps) {
  const recentReports = submissions.slice(0, limit);

  return (
    <SectionCard
      title="Recent Bug Reports"
      description="Latest bug reports submitted to the platform."
      className={className}
      action={
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Clock3 size={14} />
          <span>Most recent submissions</span>
        </div>

        <SubmissionList
          submissions={recentReports}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
        />
      </div>
    </SectionCard>
  );
}

export default RecentSubmissions;
```
