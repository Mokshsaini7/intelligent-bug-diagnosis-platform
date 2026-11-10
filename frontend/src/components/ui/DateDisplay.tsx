```tsx
import { CalendarDays } from "lucide-react";

interface DateDisplayProps {
  date: string | Date;
  format?: "short" | "medium" | "long" | "relative";
  showIcon?: boolean;
  className?: string;
}

function DateDisplay({
  date,
  format = "medium",
  showIcon = false,
  className = "",
}: DateDisplayProps) {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return (
      <span className={`text-xs text-muted ${className}`}>
        Invalid date
      </span>
    );
  }

  const formattedDate =
    format === "relative"
      ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
          Math.round(
            (parsedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          ),
          "day",
        )
      : new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: format === "short" ? "short" : "long",
          year: format === "long" ? "numeric" : undefined,
          ...(format === "medium" ? { year: "numeric" } : {}),
        }).format(parsedDate);

  return (
    <span
      className={`inline-flex items-center gap-2 text-xs text-muted ${className}`}
    >
      {showIcon && <CalendarDays size={14} aria-hidden="true" />}
      <time dateTime={parsedDate.toISOString()}>{formattedDate}</time>
    </span>
  );
}

export default DateDisplay;
```
