```tsx
import { NavLink } from "react-router-dom";
import {
  Activity,
  Bug,
  FilePlus2,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Bug Reports",
    path: "/reports",
    icon: Bug,
  },
  {
    label: "Submit Bug",
    path: "/submit",
    icon: FilePlus2,
  },
];

function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-surface">
      {/* Brand */}
      <div className="flex h-20 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              BugDiag
            </h1>
            <p className="text-xs text-muted">
              Intelligent Diagnosis
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-muted hover:bg-elevated hover:text-foreground"
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted hover:bg-elevated hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-10">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            System
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted">
              <Activity size={19} />
              <span>System Status</span>
              <span className="ml-auto h-2 w-2 rounded-full bg-success" />
            </div>

            <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted">
              <Settings size={19} />
              <span>Settings</span>
              <span className="ml-auto text-xs">Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-5">
        <div className="rounded-xl bg-elevated p-3">
          <p className="text-xs font-medium text-foreground">
            BugDiag Platform
          </p>
          <p className="mt-1 text-xs text-muted">
            Version 0.1.0 · Milestone 1
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
```
