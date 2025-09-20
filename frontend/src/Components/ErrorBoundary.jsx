import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially to a logging service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Send error to logging service if available
    if (window.pwErrorLogger) {
      window.pwErrorLogger.logError(error, errorInfo, this.props.context || 'Unknown');
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Different UI based on context
      const isAdmin = this.props.context === 'admin';
      const isPlugin = this.props.context === 'plugin';

      return (
        <div className={`error-boundary ${isAdmin ? 'admin-error' : 'frontend-error'}`}>
          <div className="error-boundary-container p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  {isPlugin ? 'Plugin Error' : isAdmin ? 'Admin Panel Error' : 'Application Error'}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {isPlugin
                      ? 'A plugin component has encountered an error and cannot be displayed.'
                      : isAdmin
                      ? 'The admin panel has encountered an error. You can try refreshing the page or contact support if the problem persists.'
                      : 'Something went wrong while loading this page. Please try again.'
                    }
                  </p>

                  {import.meta.env.MODE === 'development' && this.state.error && (
                    <details className="mt-4 p-3 bg-red-100 rounded border">
                      <summary className="cursor-pointer font-medium">Error Details (Development Mode)</summary>
                      <div className="mt-2 text-xs font-mono">
                        <p><strong>Error:</strong> {this.state.error.toString()}</p>
                        {this.state.errorInfo.componentStack && (
                          <p><strong>Component Stack:</strong></p>
                        )}
                        <pre className="whitespace-pre-wrap text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    </details>
                  )}
                </div>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={this.handleReset}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Try Again
                  </button>

                  {isAdmin && (
                    <button
                      onClick={this.handleReload}
                      className="bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Reload Page
                    </button>
                  )}

                  {!isAdmin && (
                    <a
                      href="/"
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 no-underline"
                    >
                      Go Home
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = () => setError(null);

  const handleError = React.useCallback((error, errorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    setError({ error, errorInfo });
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error.error;
    }
  }, [error]);

  return { handleError, resetError, hasError: !!error };
};

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default ErrorBoundary;