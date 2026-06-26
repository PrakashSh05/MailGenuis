import React, { Component } from 'react';
import Button from '../ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-warm-secondary dark:bg-warm-secondary flex flex-col items-center justify-center p-6 text-center select-none transition-colors duration-200">
          <div className="max-w-md w-full bg-warm-primary dark:bg-warm-primary border border-editorial-border dark:border-editorial-border rounded-3xl p-8 shadow-2xl">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-950/40 text-red-650 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-editorial-primary dark:text-editorial-primary mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-editorial-secondary dark:text-editorial-secondary mb-6">
              An unexpected client error occurred. Please try reloading the page or going back to safety.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                onClick={this.handleReset}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
