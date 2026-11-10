```tsx
import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

interface SecondaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

const SecondaryButton = forwardRef<
  HTMLButtonElement,
  SecondaryButtonProps
>(
  (
    {
      children,
      disabled,
      size = "md",
      className = "",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const sizes = {
      sm: "px-3 py-2 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-elevated font-semibold text-foreground transition",
          "hover:border-primary/40 hover:bg-border",
          "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizes[size],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  },
);

SecondaryButton.displayName = "SecondaryButton";

export default SecondaryButton;
```
