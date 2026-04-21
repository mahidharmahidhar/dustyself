import React from 'react';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {
              process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-sm text-red-800 dark:text-red-300">
                  <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
                  <pre className="whitespace-pre-wrap break-words overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )
            }

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900 transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 px-4 py-2 border border-blue-900 dark:border-blue-100 text-blue-900 dark:text-blue-100 rounded-lg font-semibold hover:bg-blue-900 hover:text-white dark:hover:bg-blue-100 dark:hover:text-blue-900 transition-all"
              >
                Go Home
              </button>
            </div>
          </div >
        </div >
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
