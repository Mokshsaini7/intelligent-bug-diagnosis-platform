```tsx
import {
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          closeOnOverlayClick &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className={`flex max-h-[90vh] w-full ${modalSizes[size]} flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl`}
      >
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2
              id="modal-title"
              className="text-lg font-semibold text-foreground"
            >
              {title}
            </h2>

            {description && (
              <p
                id="modal-description"
                className="mt-1 text-sm text-muted"
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-muted transition hover:bg-elevated hover:text-foreground"
          >
            <X size={19} />
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default Modal;
```
