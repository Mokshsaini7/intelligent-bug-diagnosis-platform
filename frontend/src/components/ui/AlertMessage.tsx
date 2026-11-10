```tsx
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertMessageProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onDismiss?: () => void;
  children?: ReactNode;
  className?: string;
}

const alertConfig = {
  success: {
    icon: CheckCircle2,
    styles: "border-success/20 bg-success/10 text-success",
  },
  error: {
    icon: AlertCircle,
    styles: "border-danger/20 bg-danger/10 text-danger",
  },
  warning: {
    icon: TriangleAlert,
    styles: "border-warning/20 bg-warning/10 text-warning",
  },
  info: {
    icon: Info,
    styles: "border-info/20 bg-info/10 text-info",
  },
};

function AlertMessage({
  variant = "info",
  title,
  message,
  onDismiss,
  children,
  className = "",
}: AlertMessageProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={[
        "flex items-start gap-3 rounded-xl border p-4",
        config.styles,
        className,
      ].join(" ")}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />

      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-sm font-semibold">{title}</h3>
        )}

        <p className={`text-sm leading-6 ${title ? "mt-1" : ""}`}>
          {message}
        </p>

        {children && (
          <div className="mt-2 text-sm">{children}</div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 rounded-lg p-1 opacity-70 transition hover:bg-black/10 hover:opacity-100"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}

export default AlertMessage;
```
