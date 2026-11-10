```tsx
import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";
import { LoaderCircle } from "lucide-react";

interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      children,
      loading = false,
      disabled,
      variant = "primary",
      size = "md",
      className = "",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover",
      secondary: "bg-elevated text-foreground hover:bg-border",
      danger: "bg-danger text-white hover:bg-danger/80",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-elevated",
    };

    const sizes = {
      sm: "px-3 py-2 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition",
          "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading && (
          <LoaderCircle size={17} className="animate-spin" />
        )}
        {children}
      </button>
    );
  },
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;
```
