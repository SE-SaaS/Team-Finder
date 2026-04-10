'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 *
 * Catches React errors in child components and displays a fallback UI
 * instead of crashing the entire app.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use the provided one
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI - GitHub style
      return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-[#dc2626]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#dc2626]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-[#f0f6fc] text-lg font-semibold mb-2">
              Something went wrong
            </h2>

            <p className="text-[#8b949e] text-sm mb-4">
              {process.env.NODE_ENV === 'development' && this.state.error
                ? this.state.error.message
                : 'An unexpected error occurred. Please try refreshing the page.'}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-md transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-sm font-medium rounded-md border border-[#30363d] transition-colors"
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-[#8b949e] text-xs cursor-pointer hover:text-[#c9d1d9] mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="text-[10px] text-[#f85149] bg-[#0d1117] p-3 rounded border border-[#30363d] overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
