import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("CampusSathi render error:", error, info);
  }

  handleRecover = () => {
    try {
      localStorage.removeItem("campussathi_user");
      localStorage.removeItem("campussathi_token");
      localStorage.removeItem("campussathi_theme");
    } catch (error) {
      console.warn("Recovery cleanup failed:", error.message);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-white">
          <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">CampusSathi</p>
            <h1 className="mt-2 text-2xl font-black">The app hit a rendering error</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The interface failed to load, but the server is running. Please hard refresh once. If the problem persists, clear site data for this app and reload.
            </p>
            <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
              {this.state.error?.message || "Unknown error"}
            </pre>
            <button
              type="button"
              onClick={this.handleRecover}
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Clear session and reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
