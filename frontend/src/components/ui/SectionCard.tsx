```tsx
import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

function SectionCard({
  title,
  description,
  action,
  children,
  className = "",
  contentClassName = "",
}: SectionCardProps) {
  return (
    <section className={`panel overflow-hidden ${className}`}>
      <header className="flex flex-col justify-between gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center md:px-6">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-muted">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="flex shrink-0 items-center gap-2">
            {action}
          </div>
        )}
      </header>

      <div className={`p-5 md:p-6 ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
}

export default SectionCard;
```
