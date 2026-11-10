```tsx
import { LoaderCircle } from "lucide-react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

const sizeStyles: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

function Spinner({
  size = "md",
  label = "Loading...",
  color = "text-primary",
  className = "",
  showLabel = false,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={[
        "inline-flex items-center gap-2",
        className,
      ].join(" ")}
    >
      <LoaderCircle
        aria-hidden="true"
        className={[
          "shrink-0 animate-spin",
          sizeStyles[size],
          color,
        ].join(" ")}
        strokeWidth={2}
      />

      {showLabel && (
        <span className="text-sm font-medium text-muted">
          {label}
        </span>
      )}

      {!showLabel && (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}

export default Spinner;
```
