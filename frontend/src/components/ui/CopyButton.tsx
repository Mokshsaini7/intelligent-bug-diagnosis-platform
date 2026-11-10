```tsx
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

function CopyButton({
  text,
  label = "Copy",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(false);

      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      disabled={!text}
      aria-label={error ? "Copy failed" : copied ? "Copied" : label}
      title={error ? "Unable to copy" : copied ? "Copied!" : label}
      className={[
        "inline-flex items-center gap-2 rounded-lg border border-border bg-elevated px-3 py-2 text-xs font-medium text-muted transition",
        "hover:border-primary/40 hover:text-foreground",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      ].join(" ")}
    >
      {copied ? (
        <>
          <Check size={14} className="text-success" />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} />
          {error ? "Copy failed" : label}
        </>
      )}
    </button>
  );
}

export default CopyButton;
```
