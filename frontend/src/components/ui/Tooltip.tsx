```tsx
import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionStyles = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

function Tooltip({
  content,
  children,
  position = "top",
  className = "",
}: TooltipProps) {
  return (
    <span className={`group relative inline-flex ${className}`}>
      {children}

      <span
        role="tooltip"
        className={[
          "pointer-events-none absolute z-50 w-max max-w-56 rounded-lg border border-border bg-elevated px-3 py-2 text-xs font-medium text-foreground shadow-lg",
          "invisible opacity-0 transition-all duration-150",
          "group-hover:visible group-hover:opacity-100",
          "group-focus-within:visible group-focus-within:opacity-100",
          positionStyles[position],
        ].join(" ")}
      >
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
```
