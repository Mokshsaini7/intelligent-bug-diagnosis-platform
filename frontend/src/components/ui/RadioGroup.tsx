```tsx
import type { InputHTMLAttributes } from "react";

interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  label?: string;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
}

function RadioGroup({
  name,
  value,
  options,
  onChange,
  label,
  direction = "vertical",
  disabled = false,
  className = "",
}: RadioGroupProps) {
  return (
    <fieldset
      disabled={disabled}
      className={`min-w-0 ${className}`}
    >
      {label && (
        <legend className="mb-3 text-sm font-semibold text-foreground">
          {label}
        </legend>
      )}

      <div
        className={
          direction === "horizontal"
            ? "flex flex-wrap gap-4"
            : "flex flex-col gap-3"
        }
      >
        {options.map((option) => {
          const optionDisabled = disabled || option.disabled;
          const selected = value === option.value;

          return (
            <label
              key={option.value}
              className={`flex items-start gap-3 ${
                optionDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                disabled={optionDisabled}
                onChange={() => onChange(option.value)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary focus:ring-2 focus:ring-primary/30"
              />

              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                  {option.label}
                </span>

                {option.description && (
                  <span className="mt-1 block text-xs leading-5 text-muted">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default RadioGroup;
```
