```tsx
import type { ReactNode } from "react";
import { Code2 } from "lucide-react";
import CopyButton from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  children?: ReactNode;
  className?: string;
}

function CodeBlock({
  code,
  language = "text",
  title,
  showCopy = true,
  children,
  className = "",
}: CodeBlockProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-[#090D14] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Code2 size={16} className="shrink-0 text-primary" />
          <span className="truncate text-xs font-medium text-muted">
            {title || language.toUpperCase()}
          </span>
        </div>

        {showCopy && <CopyButton text={code} />}
      </div>

      <pre className="max-h-[500px] overflow-auto p-4 text-sm leading-6">
        <code className="whitespace-pre text-slate-200">{code}</code>
      </pre>

      {children && (
        <div className="border-t border-border px-4 py-3 text-xs text-muted">
          {children}
        </div>
      )}
    </div>
  );
}

export default CodeBlock;
```
