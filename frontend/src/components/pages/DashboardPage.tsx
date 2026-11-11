```tsx
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { submissionService } from "../services/submissionService";

import type {
  BugSubmissionSummary,
  SubmissionStatus,
} from "../types/submission";

import DashboardStats from "../components/dashboard/DashboardStats";
import RecentSubmissions from "../components/dashboard/RecentSubmissions";
import ErrorState from "../components/ui/ErrorState";

interface DashboardStatistics {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

const initialStatistics: DashboardStatistics = {
  total: 0,
  pending: 0,
  processing: 0,
  completed: 0,
  failed: 0,
};

function DashboardPage() {
  const [submissions, setSubmissions] = useState<
    BugSubmissionSummary[]
  >([]);

  const [statistics, setStatistics] =
    useState<DashboardStatistics>(initialStatistics);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const getCount = async (status?: SubmissionStatus) => {
        const result = await submissionService.list({
          page: 1,
          page_size: 1,
          ...(status ? { status } : {}),
        });

        return result.pagination.total_items;
      };

      const [
        recentResult,
        total,
        submitted,
        pending,
        processing,
        completed,
        failed,
      ] = await Promise.all([
        submissionService.list({
          page: 1,
          page_size: 5,
        }),
        getCount(),
        getCount("submitted"),
        getCount("pending"),
        getCount("processing"),
        getCount("completed"),
        getCount("failed"),
      ]);

      setSubmissions(recentResult.data);

      setStatistics({
        total,
        pending: submitted + pending,
        processing,
        completed,
        failed,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard information.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="page-container space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold text-foreground">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-muted">
            Monitor bug reports and track their diagnosis status.
          </p>
        </div>

        <Link
          to="/submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus size={17} />
          Submit a Bug
        </Link>
      </header>

      {error ? (
        <ErrorState
          title="Dashboard unavailable"
          message={error}
          onRetry={loadDashboard}
          retryLabel="Reload dashboard"
        />
      ) : (
        <>
          <section aria-label="Bug report statistics">
            <DashboardStats
              total={statistics.total}
              pending={statistics.pending}
              processing={statistics.processing}
              completed={statistics.completed}
              failed={statistics.failed}
              isLoading={isLoading}
            />
          </section>

          <section aria-label="Recent bug reports">
            <RecentSubmissions
              submissions={submissions}
              isLoading={isLoading}
              limit={5}
            />
          </section>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
```
