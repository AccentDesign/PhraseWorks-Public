import React, { useState } from 'react';

/**
 * Test component for demonstrating error boundaries
 * Only available in development mode
 */

const BuggyComponent = ({ shouldCrash }) => {
  if (shouldCrash) {
    throw new Error('Intentional error for testing error boundaries');
  }
  return <div className="text-green-600">✅ Component rendered successfully!</div>;
};

const AsyncBuggyComponent = ({ shouldCrash }) => {
  React.useEffect(() => {
    if (shouldCrash) {
      // Simulate an async error
      setTimeout(() => {
        throw new Error('Async error for testing error boundaries');
      }, 1000);
    }
  }, [shouldCrash]);

  return <div className="text-blue-600">🔄 Async component loaded...</div>;
};

const ErrorBoundaryTest = () => {
  const [crashSync, setCrashSync] = useState(false);
  const [crashAsync, setCrashAsync] = useState(false);

  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="error-boundary-test bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 m-4">
      <h2 className="text-lg font-bold mb-4">🧪 Error Boundary Test (Development Only)</h2>

      <div className="space-y-4">
        <div className="test-section">
          <h3 className="font-semibold text-gray-700">Synchronous Error Test</h3>
          <p className="text-sm text-gray-600 mb-2">
            This tests error boundaries with synchronous errors that occur during rendering.
          </p>
          <button
            onClick={() => setCrashSync(!crashSync)}
            className={`px-4 py-2 rounded text-white font-medium ${
              crashSync
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {crashSync ? 'Fix Component' : 'Crash Component'}
          </button>
          <div className="mt-2 p-3 border rounded">
            <BuggyComponent shouldCrash={crashSync} />
          </div>
        </div>

        <div className="test-section">
          <h3 className="font-semibold text-gray-700">Asynchronous Error Test</h3>
          <p className="text-sm text-gray-600 mb-2">
            This tests handling of async errors (note: error boundaries don't catch these).
          </p>
          <button
            onClick={() => setCrashAsync(!crashAsync)}
            className={`px-4 py-2 rounded text-white font-medium ${
              crashAsync
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {crashAsync ? 'Stop Async Error' : 'Trigger Async Error'}
          </button>
          <div className="mt-2 p-3 border rounded">
            <AsyncBuggyComponent shouldCrash={crashAsync} />
          </div>
          {crashAsync && (
            <p className="text-xs text-orange-600 mt-1">
              ⚠️ Async errors will appear in console but won't be caught by error boundaries
            </p>
          )}
        </div>

        <div className="info-section">
          <h3 className="font-semibold text-gray-700">Error Boundary Coverage</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>✅ App-level error boundary</li>
            <li>✅ Route-level error boundaries (Admin/Frontend)</li>
            <li>✅ Component-level error boundaries</li>
            <li>✅ Plugin-specific error boundaries</li>
            <li>✅ Shortcode error boundaries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryTest;