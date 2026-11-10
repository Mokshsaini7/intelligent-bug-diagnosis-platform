```tsx
import {
  forwardRef,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";

interface SelectInputProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      error = false,
      options,
      placeholder = "Select an option",
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={[
            "w-full appearance-none rounded-xl border bg-background px-4 py-3 pr-11 text-sm text-foreground outline-none transition",
            "focus:ring-2 focus:ring-primary/20",
            error
              ? "border-danger focus:border-danger"
              : "border-border focus:border-primary",
            disabled ? "cursor-not-allowed opacity-50" : "",
            className,
          ].join(" ")}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
```
