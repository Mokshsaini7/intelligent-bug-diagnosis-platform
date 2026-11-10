```tsx
import type { ReactNode } from "react";

export type IndicatorStatus =
  | "online"
  | "offline"
  | "warning"
  | "processing"
  | "idle"
  | "success"
  | "error";

interface StatusIndicatorProps {
  status: IndicatorStatus;
  label?: string;
  showDot?: boolean;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
  children?: ReactNode;
}

const statusStyles: Record<
  IndicatorStatus,
  {
    dot: string;
    text: string;
    defaultLabel: string;
  }
> = {
  online: {
    dot: "bg-success",
    text: "text-success",
    defaultLabel: "Online",
  },
  offline: {
    dot: "bg-muted",
    text: "text-muted",
    defaultLabel: "Offline",
  },
  warning: {
    dot: "bg-warning",
    text: "text-warning",
    defaultLabel: "Warning",
  },
  processing: {
    dot: "bg-info",
    text: "text-info",
    defaultLabel: "Processing",
  },
  idle: {
    dot: "bg-muted",
    text: "text-muted",
    defaultLabel: "Idle",
  },
  success: {
    dot: "bg-success",
    text: "text-success",
    defaultLabel: "Successful",
  },
  error: {
    dot: "bg-danger",
    text: "text-danger",
    defaultLabel: "Error",
  },
};

function StatusIndicator({
  status,
  label,
  showDot = true,
  pulse = false,
  size = "md",
  className = "",
  children,
}: StatusIndicatorProps) {
  const styles = statusStyles[status];

  const dotSize =
    size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  const textSize =
    size === "sm" ? "text-xs" : "text-sm";

  const shouldPulse =
    pulse || status === "processing";

  return (
    <span
      className={[
        "inline-flex items-center gap-2",
        className,
      ].join(" ")}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={[
            "relative inline-flex shrink-0 rounded-full",
            dotSize,
            styles.dot,
            shouldPulse ? "animate-pulse" : "",
          ].join(" ")}
        />
      )}

      <span
        className={`${textSize} font-medium ${styles.text}`}
      >
        {label ?? styles.defaultLabel}
      </span>

      {children}
    </span>
  );
}

export default StatusIndicator;
```
