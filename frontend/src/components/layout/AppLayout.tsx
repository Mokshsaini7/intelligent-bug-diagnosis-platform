```tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={closeSidebar}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
              <Sidebar onClose={closeSidebar} />
            </div>

            <button
              type="button"
              onClick={closeSidebar}
              aria-label="Close navigation"
              className="absolute right-4 top-4 rounded-lg bg-surface p-2 text-muted hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Main Application */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1">
            <div className="page-container">
              <Outlet />
            </div>
          </main>

          <footer className="border-t border-border px-5 py-4 text-center text-xs text-muted">
            © {new Date().getFullYear()} BugDiag. Intelligent Bug Diagnosis Platform.
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
```
