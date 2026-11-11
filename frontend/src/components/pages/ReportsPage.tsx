```tsx
import { useCallback, useEffect, useState } from "react";
import { FilePlus2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { submissionService } from "../services/submissionService";
import type {
  BugSubmissionSummary,
  PaginationMeta,
  SubmissionFilters,
} from "../types/submission";

import SubmissionList from "../components/submissions/SubmissionList";
import FilterBar from "../components/ui/FilterBar";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

const PAGE_SIZE = 10;

function ReportsPage() {
  const [submissions, setSubmissions] = useState<BugSubmissionSummary[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const [filters, setFilters] = useState<SubmissionFilters>({
    search: "",
    severity: "",
    status: "",
    page: 1,
    page_size: PAGE_SIZE,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
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
          : "Unable to load bug reports. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSearchChange = (search: string) => {
    setFilters((current) => ({
      ...current,
      search,
      page: 1,
    }));
  };

  const handleSeverityChange = (severity: string) => {
    setFilters((current) => ({
      ...current,
      severity: severity as SubmissionFilters["severity"],
      page: 1,
    }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((current) => ({
      ...current,
      status: status as SubmissionFilters["status"],
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      severity: "",
      status: "",
      page: 1,
      page_size: PAGE_SIZE,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  return (
    <div className="page-container space-y-6">
      <PageHeader
        eyebrow="Bug Management"
        title="Bug Reports"
        description="Search, filter, and manage submitted software defects."
        action={
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <FilePlus2 size={17} />
            Submit Bug
          </Link>
        }
      />

      <FilterBar
        search={filters.search ?? ""}
        severity={filters.severity ?? ""}
        status={filters.status ?? ""}
        onSearchChange={handleSearchChange}
        onSeverityChange={handleSeverityChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
      />

      {error ? (
        <ErrorState
          title="Failed to load reports"
          message={error}
          onRetry={fetchSubmissions}
        />
      ) : isLoading ? (
        <LoadingState label="Loading bug reports..." />
      ) : submissions.length === 0 ? (
        <EmptyState
          title="No bug reports found"
          description="Try changing your filters or submit your first bug report."
          action={
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <FilePlus2 size={16} />
              Submit a Bug
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {submissions.length}
              </span>{" "}
              reports
              {pagination && (
                <>
                  {" "}of{" "}
                  <span className="font-semibold text-foreground">
                    {pagination.total_items}
                  </span>
                </>
              )}
            </p>

            <button
              type="button"
              onClick={() => void fetchSubmissions()}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <SubmissionList submissions={submissions} />

          {pagination && pagination.total_pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ReportsPage;
```
