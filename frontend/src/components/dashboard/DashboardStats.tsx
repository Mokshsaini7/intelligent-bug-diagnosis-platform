```tsx
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
} from "lucide-react";

import StatCard from "../ui/StatCard";
import type { SubmissionStatus } from "../../types/submission";

interface DashboardStatsProps {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  isLoading?: boolean;
  className?: string;
}

function DashboardStats({
  total,
  pending,
  processing,
  completed,
  failed,
  isLoading = false,
  className = "",
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Reports",
      value: total,
      icon: FileText,
      description: "All submitted bug reports",
      color: "primary" as const,
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      description: "Awaiting diagnosis",
      color: "warning" as const,
    },
    {
      title: "Processing",
      value: processing,
      icon: LoaderCircle,
      description: "Currently being processed",
      color: "info" as const,
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      description: "Diagnosis completed",
      color: "success" as const,
    },
    {
      title: "Failed",
      value: failed,
      icon: AlertCircle,
      description: "Require attention",
      color: "danger" as const,
    },
  ];

  if (isLoading) {
    return (
      <div
        className={[
          "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5",
          className,
        ].join(" ")}
      >
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="h-32 animate-pulse rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={[
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5",
        className,
      ].join(" ")}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          color={stat.color}
        />
      ))}
    </div>
  );
}

export default DashboardStats;
```
