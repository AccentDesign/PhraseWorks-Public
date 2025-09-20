import System from '../models/system.js';

/**
 * Standardized error handler for backend components
 * Logs errors both to console and to the System.writeLogData
 *
 * @param {Error|string} error - The error to log
 * @param {string} context - Context/location where the error occurred (e.g., 'GraphQL.getUsers', 'Plugin.zeroG.createForm')
 * @param {Object} options - Additional options for error handling
 * @param {boolean} options.silent - If true, suppresses console logging (default: false)
 * @param {string} options.logType - Log type for System.writeLogData (default: 'backend')
 * @param {Object} options.additionalData - Additional data to include in the error log
 * @param {boolean} options.includeStack - Whether to include stack trace in logs (default: true)
 */
export const handleError = async (error, context = 'Unknown', options = {}) => {
  const {
    silent = false,
    logType = 'backend',
    additionalData = {},
    includeStack = true
  } = options;

  // Extract error message and stack trace
  const errorMessage = error?.message || String(error);
  const errorStack = error?.stack || String(error);

  // Create comprehensive error context
  const errorContext = {
    context,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    ...additionalData
  };

  // Log to console for development (unless silent)
  if (!silent) {
    console.group(`🚨 [${context}] Backend Error`);
    console.error('Message:', errorMessage);
    if (includeStack) {
      console.error('Stack:', errorStack);
    }
    console.error('Context:', errorContext);
    console.groupEnd();
  }

  try {
    // Create structured log data
    const logData = {
      message: errorMessage,
      context: errorContext,
      ...(includeStack && { stack: errorStack })
    };

    // Log to System.writeLogData
    await System.writeLogData(JSON.stringify(logData), logType);
  } catch (logError) {
    // If System logging fails, at least log to console
    console.error('Failed to log error via System.writeLogData:', logError);
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
 * Handle errors in GraphQL resolvers with automatic context detection
 *
 * @param {Error} error - The error to handle
 * @param {string} resolverName - Name of the GraphQL resolver
 * @param {string} operation - Name of the operation (query/mutation)
 * @param {Object} args - GraphQL arguments for additional context
 * @param {Object} options - Additional options
 */
export const handleResolverError = async (error, resolverName, operation, args = {}, options = {}) => {
  const context = `GraphQL.${resolverName}.${operation}`;
  const additionalData = {
    args: JSON.stringify(args),
    operation,
    resolver: resolverName
  };

  await handleError(error, context, {
    ...options,
    additionalData: { ...additionalData, ...options.additionalData }
  });
};

/**
 * Handle errors in plugin operations
 *
 * @param {Error} error - The error to handle
 * @param {string} pluginName - Name of the plugin
 * @param {string} operation - Name of the operation
 * @param {Object} options - Additional options
 */
export const handlePluginError = async (error, pluginName, operation, options = {}) => {
  const context = `Plugin.${pluginName}.${operation}`;
  await handleError(error, context, options);
};

/**
 * Handle errors in model operations (database operations)
 *
 * @param {Error} error - The error to handle
 * @param {string} modelName - Name of the model
 * @param {string} operation - Name of the operation
 * @param {Object} options - Additional options
 */
export const handleModelError = async (error, modelName, operation, options = {}) => {
  const context = `Model.${modelName}.${operation}`;
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
 * Legacy wrapper to maintain compatibility with existing System.writeLogData calls
 * @deprecated Use handleError instead for better error context
 */
export const logError = async (error, logType = 'backend') => {
  await handleError(error, 'Legacy.logError', { silent: true, logType });
};

/**
 * Utility to handle common database errors with user-friendly messages
 *
 * @param {Error} error - Database error
 * @param {string} operation - Operation that failed
 * @returns {Object} - Standardized error response
 */
export const handleDatabaseError = async (error, operation) => {
  await handleError(error, `Database.${operation}`);

  // Return user-friendly error based on common PostgreSQL error codes
  switch (error.code) {
    case '23505': // unique_violation
      return {
        success: false,
        error: 'A record with this information already exists.',
        code: 'DUPLICATE_ENTRY'
      };
    case '23503': // foreign_key_violation
      return {
        success: false,
        error: 'Cannot perform this operation due to related data constraints.',
        code: 'FOREIGN_KEY_VIOLATION'
      };
    case '23502': // not_null_violation
      return {
        success: false,
        error: 'Required information is missing.',
        code: 'MISSING_REQUIRED_FIELD'
      };
    case '42703': // undefined_column
      return {
        success: false,
        error: 'Database schema error. Please contact support.',
        code: 'SCHEMA_ERROR'
      };
    default:
      return {
        success: false,
        error: 'A database error occurred. Please try again.',
        code: 'DATABASE_ERROR'
      };
  }
};