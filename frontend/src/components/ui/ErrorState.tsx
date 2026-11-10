```tsx
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't complete your request. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={[
        "flex min-h-[260px] flex-col items-center justify-center rounded-panel border border-danger/20 bg-surface px-6 py-10 text-center",
        className,
      ].join(" ")}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <AlertCircle size={28} />
      </div>

      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
        >
          <RefreshCw size={16} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export default ErrorState;
```
