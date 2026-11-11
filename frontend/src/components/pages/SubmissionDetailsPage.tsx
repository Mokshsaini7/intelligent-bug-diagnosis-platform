```tsx
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import { submissionService } from "../services/submissionService";
import type { BugSubmission } from "../types/submission";

import SubmissionSummary from "../components/submissions/SubmissionSummary";
import SubmissionDetails from "../components/submissions/SubmissionDetails";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import AlertMessage from "../components/ui/AlertMessage";

function SubmissionDetailsPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<BugSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmission = useCallback(async () => {
    if (!submissionId) {
      setError("A valid bug report ID was not provided.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await submissionService.getById(submissionId);
      setSubmission(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load this bug report.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    void fetchSubmission();
  }, [fetchSubmission]);

  return (
    <div className="page-container space-y-6">
      <button
        type="button"
        onClick={() => navigate("/reports")}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Bug Reports
      </button>

      <PageHeader
        eyebrow="Bug Management"
        title="Bug Report Details"
        description="Review the submitted issue and its technical information."
        action={
          <button
            type="button"
            onClick={() => void fetchSubmission()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        }
      />

      {error ? (
        <ErrorState
          title="Unable to load bug report"
          message={error}
          onRetry={fetchSubmission}
        />
      ) : isLoading ? (
        <LoadingState label="Loading bug report details..." />
      ) : submission ? (
        <div className="space-y-6">
          <SubmissionSummary submission={submission} />

          <SubmissionDetails submission={submission} />

          <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-5">
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-elevated"
            >
              <ArrowLeft size={16} />
              All Reports
            </Link>

            <span className="self-center text-xs text-muted">
              Report ID: {submission.id}
            </span>
          </div>
        </div>
      ) : (
        <AlertMessage
          variant="warning"
          title="Report unavailable"
          message="The requested bug report could not be found."
        />
      )}
    </div>
  );
}

export default SubmissionDetailsPage;
```
