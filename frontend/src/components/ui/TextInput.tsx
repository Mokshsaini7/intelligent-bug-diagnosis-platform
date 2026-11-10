```tsx
import { forwardRef, type InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leadingIcon?: React.ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      error = false,
      leadingIcon,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
            {leadingIcon}
          </span>
        )}

        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={[
            "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition",
            "placeholder:text-muted/70 focus:ring-2 focus:ring-primary/20",
            leadingIcon ? "pl-10" : "",
            error
              ? "border-danger focus:border-danger"
              : "border-border focus:border-primary",
            disabled ? "cursor-not-allowed opacity-50" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
```
