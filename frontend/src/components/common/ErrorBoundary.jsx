import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px", textAlign: "center", color: "#fca5a5",
          background: "rgba(239,68,68,0.06)", borderRadius: 16,
          border: "1px solid rgba(239,68,68,0.2)", margin: 20,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Something went wrong</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{this.state.error?.message}</div>
          <button onClick={() => this.setState({ hasError: false })} style={{
            marginTop: 16, padding: "8px 20px", background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8,
            color: "#fca5a5", cursor: "pointer", fontFamily: "var(--font-body)",
          }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
