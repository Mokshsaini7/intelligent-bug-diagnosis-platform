```tsx
import type { SeverityLevel } from "../../types/submission";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

const severityStyles: Record<SeverityLevel, string> = {
  low: "border-slate-500/20 bg-slate-500/10 text-slate-400",
  medium: "border-info/20 bg-info/10 text-info",
  high: "border-warning/20 bg-warning/10 text-warning",
  critical: "border-danger/20 bg-danger/10 text-danger",
};

function SeverityBadge({
  severity,
  className = "",
}: SeverityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${severityStyles[severity]} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          severity === "critical"
            ? "bg-danger"
            : severity === "high"
              ? "bg-warning"
              : severity === "medium"
                ? "bg-info"
                : "bg-slate-400"
        }`}
      />

      {severity}
    </span>
  );
}

export default SeverityBadge;
```
