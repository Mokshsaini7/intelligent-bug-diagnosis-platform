```tsx
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  title?: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
  children?: ReactNode;
  className?: string;
}

const toastStyles: Record<
  ToastVariant,
  {
    container: string;
    icon: string;
    Icon: typeof CheckCircle2;
    role: "status" | "alert";
  }
> = {
  success: {
    container: "border-success/30 bg-success/10",
    icon: "text-success",
    Icon: CheckCircle2,
    role: "status",
  },
  error: {
    container: "border-danger/30 bg-danger/10",
    icon: "text-danger",
    Icon: XCircle,
    role: "alert",
  },
  warning: {
    container: "border-warning/30 bg-warning/10",
    icon: "text-warning",
    Icon: AlertCircle,
    role: "alert",
  },
  info: {
    container: "border-info/30 bg-info/10",
    icon: "text-info",
    Icon: Info,
    role: "status",
  },
};

function Toast({
  message,
  title,
  variant = "info",
  onDismiss,
  children,
  className = "",
}: ToastProps) {
  const styles = toastStyles[variant];
  const Icon = styles.Icon;

  return (
    <div
      role={styles.role}
      aria-live={variant === "error" || variant === "warning" ? "assertive" : "polite"}
      className={[
        "flex items-start gap-3 rounded-xl border p-4 shadow-lg",
        "animate-in fade-in slide-in-from-top-2 duration-200",
        styles.container,
        className,
      ].join(" ")}
    >
      <Icon
        size={20}
        className={`mt-0.5 shrink-0 ${styles.icon}`}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        {title && (
          <p className="text-sm font-semibold text-foreground">
            {title}
          </p>
        )}

        <p className="text-sm leading-relaxed text-foreground/90">
          {message}
        </p>

        {children && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 rounded-lg p-1 text-muted transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default Toast;
```
