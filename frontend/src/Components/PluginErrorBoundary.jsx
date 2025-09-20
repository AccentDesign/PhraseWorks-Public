import React from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Specialized error boundary for plugin components
 * Provides plugin-specific error handling and recovery options
 */
const PluginErrorBoundary = ({ pluginName, children, fallback }) => {
  const customFallback = fallback || (
    <div className="plugin-error-boundary bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Plugin Error: {pluginName || 'Unknown Plugin'}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              This plugin has encountered an error and cannot be displayed.
              The plugin may be incompatible with the current version or have a coding issue.
            </p>
          </div>
          <div className="mt-4">
            <div className="flex">
              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-100 px-2 py-1 rounded text-sm text-yellow-800 hover:bg-yellow-200 mr-2"
              >
                Reload Page
              </button>
              <a
                href="/admin/plugins"
                className="bg-yellow-100 px-2 py-1 rounded text-sm text-yellow-800 hover:bg-yellow-200 no-underline"
              >
                Manage Plugins
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      context="plugin"
      fallback={customFallback}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PluginErrorBoundary;