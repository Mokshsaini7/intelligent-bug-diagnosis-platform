```tsx
import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  CircleAlert,
  Send,
} from "lucide-react";

import type { SubmissionStatus } from "../../types/submission";

interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

const statusConfig: Record<
  SubmissionStatus,
  {
    label: string;
    styles: string;
    icon: typeof CheckCircle2;
  }
> = {
  submitted: {
    label: "Submitted",
    styles: "border-info/20 bg-info/10 text-info",
    icon: Send,
  },
  pending: {
    label: "Pending",
    styles: "border-warning/20 bg-warning/10 text-warning",
    icon: Clock3,
  },
  processing: {
    label: "Processing",
    styles: "border-primary/20 bg-primary/10 text-primary",
    icon: LoaderCircle,
  },
  completed: {
    label: "Completed",
    styles: "border-success/20 bg-success/10 text-success",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    styles: "border-danger/20 bg-danger/10 text-danger",
    icon: CircleAlert,
  },
};

function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.styles} ${className}`}
    >
      <Icon
        size={13}
        className={status === "processing" ? "animate-spin" : ""}
      />

      {config.label}
    </span>
  );
}

export default StatusBadge;
```
