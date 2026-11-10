```tsx
import type { ReactNode } from "react";
import { X } from "lucide-react";

type TagVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  default: "border-border bg-elevated text-muted",
  primary: "border-primary/20 bg-primary/10 text-primary",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger",
  info: "border-info/20 bg-info/10 text-info",
};

function Tag({
  children,
  variant = "default",
  removable = false,
  onRemove,
  className = "",
}: TagProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      ].join(" ")}
    >
      {children}

      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove tag"
          className="rounded-full p-0.5 transition hover:bg-black/10"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}

export default Tag;
```
