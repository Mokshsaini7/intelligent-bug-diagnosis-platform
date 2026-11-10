```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import Toast from "./Toast";
import type { ToastVariant } from "./Toast";

interface ToastItem {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
}

interface ToastOptions {
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => string;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);

const MAX_VISIBLE_TOASTS = 5;
const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id),
    );
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (options: ToastOptions): string => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const toast: ToastItem = {
        id,
        message: options.message,
        title: options.title,
        variant: options.variant ?? "info",
      };

      setToasts((current) => [
        ...current,
        toast,
      ].slice(-MAX_VISIBLE_TOASTS));

      const duration = options.duration ?? DEFAULT_DURATION;

      if (duration > 0) {
        window.setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss],
  );

  const success = useCallback(
    (message: string, title?: string) =>
      showToast({ message, title, variant: "success" }),
    [showToast],
  );

  const error = useCallback(
    (message: string, title?: string) =>
      showToast({ message, title, variant: "error" }),
    [showToast],
  );

  const warning = useCallback(
    (message: string, title?: string) =>
      showToast({ message, title, variant: "warning" }),
    [showToast],
  );

  const info = useCallback(
    (message: string, title?: string) =>
      showToast({ message, title, variant: "info" }),
    [showToast],
  );

  const contextValue = useMemo(
    () => ({
      showToast,
      success,
      error,
      warning,
      info,
      dismiss,
      dismissAll,
    }),
    [
      showToast,
      success,
      error,
      warning,
      info,
      dismiss,
      dismissAll,
    ],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              title={toast.title}
              variant={toast.variant}
              onDismiss={() => dismiss(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used within a ToastProvider.",
    );
  }

  return context;
}
```
