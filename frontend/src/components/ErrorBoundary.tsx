```tsx
import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Replace with a monitoring service when one is configured.
    if (import.meta.env.DEV) {
      console.error("Application rendering error:", error);
      console.error("Component stack:", errorInfo.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-panel">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
              <AlertTriangle
                size={30}
                className="text-danger"
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-6 text-xl font-bold text-foreground">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              An unexpected application error occurred. You can try
              rendering the application again.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-5 max-h-40 overflow-auto rounded-lg bg-background p-3 text-left text-xs text-danger">
                {this.state.error.message}
              </pre>
            )}

            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```
