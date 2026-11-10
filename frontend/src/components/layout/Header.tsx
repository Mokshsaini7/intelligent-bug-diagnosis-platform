```tsx
import { useEffect, useState } from "react";
import { Menu, Bell, Search, Wifi, WifiOff } from "lucide-react";
import { useLocation } from "react-router-dom";

import { api } from "../../lib/api";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/submit": "Submit Bug Report",
  "/reports": "Bug Reports",
};

function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();

  const [backendOnline, setBackendOnline] = useState<boolean | null>(
    null,
  );

  const pageTitle =
    location.pathname.startsWith("/reports/") 
      ? "Bug Details"
      : pageTitles[location.pathname] ?? "BugDiag";

  useEffect(() => {
    let active = true;

    const checkBackend = async () => {
      try {
        await api.get("/../health", { timeout: 5000 });

        if (active) {
          setBackendOnline(true);
        }
      } catch {
        if (active) {
          setBackendOnline(false);
        }
      }
    };

    void checkBackend();

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-surface px-5 md:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-muted hover:bg-elevated hover:text-foreground lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {pageTitle}
          </h2>

          <p className="hidden text-xs text-muted sm:block">
            Intelligent Bug Diagnosis Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-xs sm:flex ${
            backendOnline === true
              ? "border-success/20 bg-success/10 text-success"
              : backendOnline === false
                ? "border-danger/20 bg-danger/10 text-danger"
                : "border-border bg-elevated text-muted"
          }`}
        >
          {backendOnline === true ? (
            <Wifi size={14} />
          ) : (
            <WifiOff size={14} />
          )}

          {backendOnline === true
            ? "Backend Connected"
            : backendOnline === false
              ? "Backend Offline"
              : "Checking Backend"}
        </div>

        <button
          type="button"
          aria-label="Search"
          className="rounded-lg p-2 text-muted hover:bg-elevated hover:text-foreground"
        >
          <Search size={19} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-muted hover:bg-elevated hover:text-foreground"
        >
          <Bell size={19} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          BD
        </div>
      </div>
    </header>
  );
}

export default Header;
```
