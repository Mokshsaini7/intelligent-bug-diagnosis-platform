```tsx
import {
  forwardRef,
  type TextareaHTMLAttributes,
} from "react";

interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error = false, className = "", disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={[
          "min-h-[120px] w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition",
          "placeholder:text-muted/70 focus:ring-2 focus:ring-primary/20",
          error
            ? "border-danger focus:border-danger"
            : "border-border focus:border-primary",
          disabled ? "cursor-not-allowed opacity-50" : "",
          className,
        ].join(" ")}
        {...props}
      />
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
```
