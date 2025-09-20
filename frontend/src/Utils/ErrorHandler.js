import { APILogError } from '../API/APISystem';

/**
 * Standardized error handler for frontend components
 * Logs errors both to console and to the backend error logging system
 *
 * @param {Error|string} error - The error to log
 * @param {string} context - Context/location where the error occurred (e.g., 'MainRoutes.loadTheme', 'HeaderComponent.fetchMenu')
 * @param {Object} options - Additional options for error handling
 * @param {boolean} options.silent - If true, suppresses console logging (default: false)
 * @param {Object} options.additionalData - Additional data to include in the error log
 */
export const handleError = async (error, context = 'Unknown', options = {}) => {
  const { silent = false, additionalData = {} } = options;

  // Extract error message and stack trace
  const errorMessage = error?.message || String(error);
  const errorStack = error?.stack || String(error);

  // Create comprehensive error context
  const errorContext = {
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...additionalData
  };

  // Log to console for development (unless silent)
  if (!silent) {
    console.group(`🚨 Error in ${context}`);
    console.error('Message:', errorMessage);
    console.error('Stack:', errorStack);
    console.error('Context:', errorContext);
    console.groupEnd();
  }

  try {
    // Log to backend error system
    const logData = {
      message: errorMessage,
      stack: errorStack,
      context: JSON.stringify(errorContext)
    };

    await APILogError(JSON.stringify(logData));
  } catch (logError) {
    // If backend logging fails, at least log to console
    console.error('Failed to log error to backend:', logError);
    console.error('Original error that failed to log:', { errorMessage, errorStack, errorContext });
  }
};

/**
 * Wrapper for async functions to automatically handle errors
 *
 * @param {Function} asyncFn - The async function to wrap
 * @param {string} context - Context for error logging
 * @param {Object} options - Error handling options
 * @returns {Function} - Wrapped function that handles errors
 */
export const withErrorHandler = (asyncFn, context, options = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      await handleError(error, context, options);

      // Re-throw the error if specified (default behavior)
      if (!options.suppressThrow) {
        throw error;
      }
    }
  };
};

/**
 * Handle errors in React components with automatic context detection
 *
 * @param {Error} error - The error to handle
 * @param {string} componentName - Name of the React component
 * @param {string} functionName - Name of the function where error occurred
 * @param {Object} options - Additional options
 */
export const handleComponentError = async (error, componentName, functionName, options = {}) => {
  const context = `${componentName}.${functionName}`;
  await handleError(error, context, options);
};

/**
 * Create a standardized error object for consistent error handling
 *
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {Object} details - Additional error details
 * @returns {Error} - Standardized error object
 */
export const createError = (message, code = 'UNKNOWN_ERROR', details = {}) => {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  error.timestamp = new Date().toISOString();
  return error;
};

/**
 * Legacy wrapper to maintain compatibility with existing APILogError calls
 * @deprecated Use handleError instead for better error context
 */
export const logError = async (error) => {
  await handleError(error, 'Legacy.logError', { silent: true });
};