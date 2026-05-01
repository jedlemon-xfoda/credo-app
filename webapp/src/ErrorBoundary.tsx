import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-shell">
          <section className="error-card">
            <p className="eyebrow">Something went wrong</p>
            <h1>The app needs a refresh.</h1>
            <p>
              Your saved local data should still be in this browser. Refresh the page to restore
              the app.
            </p>
            <button type="button" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
