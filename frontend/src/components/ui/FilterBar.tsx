```tsx
import { Search, X } from "lucide-react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import SecondaryButton from "./SecondaryButton";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}

const severityOptions: FilterOption[] = [
  { label: "All severities", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const statusOptions: FilterOption[] = [
  { label: "All statuses", value: "" },
  { label: "Submitted", value: "submitted" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

function FilterBar({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  status,
  onStatusChange,
  onReset,
  className = "",
}: FilterBarProps) {
  const hasActiveFilters = Boolean(search || severity || status);

  return (
    <div
      className={`panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center ${className}`}
    >
      <div className="relative min-w-0 flex-1">
        <TextInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search bug reports..."
          aria-label="Search bug reports"
          leadingIcon={<Search size={17} />}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[360px]">
        <SelectInput
          aria-label="Filter by severity"
          value={severity}
          onChange={(event) => onSeverityChange(event.target.value)}
          options={severityOptions}
          placeholder="All severities"
        />

        <SelectInput
          aria-label="Filter by status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          options={statusOptions}
          placeholder="All statuses"
        />
      </div>

      {hasActiveFilters && (
        <SecondaryButton
          size="md"
          onClick={onReset}
          className="shrink-0"
        >
          <X size={15} />
          Clear filters
        </SecondaryButton>
      )}
    </div>
  );
}

export default FilterBar;
```
