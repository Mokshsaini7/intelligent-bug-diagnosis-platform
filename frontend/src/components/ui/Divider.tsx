```tsx
import type { ReactNode } from "react";

interface DividerProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  children?: ReactNode;
}

function Divider({
  label,
  orientation = "horizontal",
  className = "",
  children,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`h-full w-px bg-border ${className}`}
      />
    );
  }

  const content = children ?? label;

  if (!content) {
    return (
      <hr
        className={`border-0 border-t border-border ${className}`}
      />
    );
  }

  return (
    <div
      role="separator"
      className={`flex items-center gap-4 ${className}`}
    >
      <span className="h-px flex-1 bg-border" />
      <span className="shrink-0 text-xs font-medium text-muted">
        {content}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export default Divider;
```
