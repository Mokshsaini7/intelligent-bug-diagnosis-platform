```tsx
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  accentColor?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  accentColor = "text-primary",
}: StatCardProps) {
  return (
    <div className="panel p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-elevated ${accentColor}`}
        >
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="text-xs text-muted">
          {description}
        </p>

        {trend && (
          <span
            className={`flex shrink-0 items-center gap-1 text-xs font-medium ${
              trend.direction === "up"
                ? "text-success"
                : trend.direction === "down"
                  ? "text-danger"
                  : "text-muted"
            }`}
          >
            {trend.direction === "up" && (
              <ArrowUpRight size={14} />
            )}

            {trend.direction === "down" && (
              <ArrowDownRight size={14} />
            )}

            {trend.direction === "neutral" && (
              <Minus size={14} />
            )}

            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
```
