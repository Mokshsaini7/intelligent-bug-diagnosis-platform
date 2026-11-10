```tsx
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const safeTotalPages = Math.max(0, totalPages);

  if (safeTotalPages <= 1) return null;

  const page = Math.min(
    Math.max(1, currentPage),
    safeTotalPages,
  );

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(safeTotalPages, page + 2);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  const buttonClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border text-sm font-medium transition hover:border-primary/40 hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-col items-center justify-between gap-4 sm:flex-row ${className}`}
    >
      <p className="text-xs text-muted">
        Page <span className="font-semibold text-foreground">{page}</span>
        {" "}of{" "}
        <span className="font-semibold text-foreground">
          {safeTotalPages}
        </span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="First page"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className={buttonClass}
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={buttonClass}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={`${buttonClass} ${
              pageNumber === page
                ? "border-primary bg-primary text-white hover:bg-primary-hover"
                : "text-muted"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          aria-label="Next page"
          disabled={page === safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          className={buttonClass}
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          aria-label="Last page"
          disabled={page === safeTotalPages}
          onClick={() => onPageChange(safeTotalPages)}
          className={buttonClass}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
```
