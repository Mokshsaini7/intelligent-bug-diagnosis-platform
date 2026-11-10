```tsx
import type { LucideIcon } from "lucide-react";
import { FileSearch } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
}

function EmptyState({
  title = "No records found",
  description = "There is nothing to display here yet.",
  icon: Icon = FileSearch,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-panel border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated text-muted">
        <Icon size={30} strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
```
