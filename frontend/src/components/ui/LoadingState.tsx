```tsx
import { LoaderCircle } from "lucide-react";

interface LoadingStateProps {
  label?: string;
  fullHeight?: boolean;
  className?: string;
}

function LoadingState({
  label = "Loading...",
  fullHeight = false,
  className = "",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex flex-col items-center justify-center gap-3 text-muted",
        fullHeight ? "min-h-[60vh]" : "min-h-[180px]",
        className,
      ].join(" ")}
    >
      <LoaderCircle
        size={30}
        strokeWidth={2}
        className="animate-spin text-primary"
        aria-hidden="true"
      />
      <p className="text-sm font-medium">{label}</p>
      <span className="sr-only">Please wait.</span>
    </div>
  );
}

export default LoadingState;
```
