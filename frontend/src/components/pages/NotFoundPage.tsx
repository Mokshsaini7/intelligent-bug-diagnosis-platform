```tsx
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bug, Home, Search } from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
          <Bug size={36} className="text-primary" />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
          The page you're looking for doesn't exist, may have been moved,
          or the address may be incorrect.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <Home size={17} />
            Go to Dashboard
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-elevated"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
          >
            <Search size={15} />
            Browse Bug Reports
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;
```
