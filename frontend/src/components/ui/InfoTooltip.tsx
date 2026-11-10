```tsx
import { Info } from "lucide-react";
import Tooltip from "./Tooltip";

interface InfoTooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

function InfoTooltip({
  content,
  position = "top",
  className = "",
}: InfoTooltipProps) {
  return (
    <Tooltip
      content={content}
      position={position}
      className={className}
    >
      <button
        type="button"
        aria-label="More information"
        className="inline-flex items-center justify-center rounded-full text-muted transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <Info size={16} />
      </button>
    </Tooltip>
  );
}

export default InfoTooltip;
```
