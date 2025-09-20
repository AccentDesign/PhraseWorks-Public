# Error Handling & Error Boundaries

This document outlines the comprehensive error handling system implemented across the PhraseWorks application, including standardized error handling utilities and React error boundaries.

## Overview

PhraseWorks implements a multi-layer error handling approach:

1. **Error Handling Utilities**: Standardized error logging for frontend and backend
2. **React Error Boundaries**: Graceful UI error recovery for React components
3. **WebSocket Error Resilience**: Robust connection management with StrictMode compatibility

### Core Components

- **Frontend Error Handler**: `/frontend/src/Utils/ErrorHandler.js`
- **Backend Error Handler**: `/backend/src/utils/errorHandler.js`
- **Error Boundary Component**: `/frontend/src/Utils/ErrorBoundary.jsx`
- **WebSocket Error Handling**: Enhanced connection management

## Frontend Error Handling

### Basic Usage

```javascript
import { handleError, handleComponentError } from '../Utils/ErrorHandler';

// Basic error handling
try {
  await someAsyncOperation();
} catch (error) {
  await handleError(error, 'ComponentName.functionName');
}

// React component error handling
try {
  await loadData();
} catch (error) {
  await handleComponentError(error, 'UserList', 'loadData');
}
```

### Available Functions

#### `handleError(error, context, options)`
- **error**: Error object or string
- **context**: String describing where the error occurred
- **options**: Configuration object
  - `silent`: Suppress console logging (default: false)
  - `additionalData`: Extra data to include in logs

#### `handleComponentError(error, componentName, functionName, options)`
- Specialized for React components
- Automatically creates context as `${componentName}.${functionName}`

#### `withErrorHandler(asyncFn, context, options)`
- Wrapper for async functions with automatic error handling

#### `createError(message, code, details)`
- Creates standardized error objects

### Migration from APILogError

**Old pattern:**
```javascript
try {
  await someOperation();
} catch (err) {
  await APILogError(err.stack || String(err));
  console.error('Operation failed:', err);
}
```

**New pattern:**
```javascript
try {
  await someOperation();
} catch (err) {
  await handleComponentError(err, 'ComponentName', 'operationName');
}
```

## Backend Error Handling

### Basic Usage

```javascript
import { handleError, handleResolverError, handleModelError } from '../../utils/errorHandler.js';

// Basic error handling
try {
  await someOperation();
} catch (error) {
  await handleError(error, 'Service.operationName');
}

// GraphQL resolver error handling
try {
  return await getUserById(id);
} catch (error) {
  await handleResolverError(error, 'user', 'getUserById', { id });
  return { success: false, error: error.message };
}
```

### Available Functions

#### `handleError(error, context, options)`
- **error**: Error object or string
- **context**: String describing where the error occurred
- **options**: Configuration object
  - `silent`: Suppress console logging (default: false)
  - `logType`: Type for System.writeLogData (default: 'backend')
  - `additionalData`: Extra data to include in logs
  - `includeStack`: Include stack trace (default: true)

#### `handleResolverError(error, resolverName, operation, args, options)`
- Specialized for GraphQL resolvers
- Automatically includes operation context and arguments

#### `handleModelError(error, modelName, operation, options)`
- Specialized for database model operations

#### `handlePluginError(error, pluginName, operation, options)`
- Specialized for plugin operations

#### `handleDatabaseError(error, operation)`
- Handles common PostgreSQL errors with user-friendly messages
- Returns standardized error responses

### Migration from System.writeLogData

**Old pattern:**
```javascript
try {
  await operation();
} catch (err) {
  await System.writeLogData(err.stack || String(err), 'backend');
  console.error('Operation failed:', err);
}
```

**New pattern:**
```javascript
try {
  await operation();
} catch (err) {
  await handleError(err, 'Module.operationName');
}
```

## Benefits

### 1. **Consistent Logging**
- All errors follow the same format
- Automatic inclusion of context and metadata
- Centralized error logging logic

### 2. **Better Debugging**
- Rich context information (timestamp, URL, user agent, etc.)
- Grouped console output for development
- Stack traces and additional data included

### 3. **Improved Monitoring**
- Structured error data for better analysis
- Automatic categorization by context
- Integration with existing logging systems

### 4. **Developer Experience**
- Simplified API reduces boilerplate
- Automatic context detection for common patterns
- Type-safe error objects

## Best Practices

### 1. **Use Descriptive Contexts**
```javascript
// Good
await handleError(error, 'UserService.validatePassword');

// Better
await handleError(error, 'UserService.validatePassword', {
  additionalData: { userId, attemptCount }
});
```

### 2. **Choose the Right Function**
- Use `handleComponentError` for React components
- Use `handleResolverError` for GraphQL resolvers
- Use `handleModelError` for database operations
- Use `handleError` for general cases

### 3. **Include Relevant Context**
```javascript
await handleResolverError(error, 'user', 'updateProfile', { userId, updates }, {
  additionalData: { userRole, timestamp: Date.now() }
});
```

### 4. **Handle Database Errors Gracefully**
```javascript
try {
  await User.create(userData);
} catch (error) {
  return await handleDatabaseError(error, 'createUser');
}
```

## Examples

### Frontend Component
```javascript
import { handleComponentError } from '../Utils/ErrorHandler';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  const loadUser = async (userId) => {
    try {
      const userData = await APIGetUser(userId);
      setUser(userData);
    } catch (error) {
      await handleComponentError(error, 'UserProfile', 'loadUser', {
        additionalData: { userId }
      });
    }
  };

  // ...rest of component
};
```

### Backend Resolver
```javascript
import { handleResolverError, handleDatabaseError } from '../../utils/errorHandler.js';

const userResolvers = {
  Query: {
    getUser: async (_, { id }, { connection, isAuth }) => {
      if (!isAuth) {
        return { success: false, error: 'Unauthorized' };
      }

      try {
        const user = await connection`
          SELECT * FROM pw_users WHERE id = ${id}
        `;
        return { success: true, user: user[0] };
      } catch (error) {
        await handleResolverError(error, 'user', 'getUser', { id });
        return { success: false, error: 'Failed to fetch user' };
      }
    }
  }
};
```

## Legacy Support

Both utilities include legacy wrapper functions to maintain compatibility with existing code:

- `logError()` - Frontend compatibility with APILogError
- `logError()` - Backend compatibility with System.writeLogData

These can be used as drop-in replacements while migrating to the new patterns.

## React Error Boundaries

PhraseWorks includes a comprehensive React Error Boundary system that gracefully handles component failures and provides user-friendly error recovery.

### Error Boundary Component

Location: `/frontend/src/Utils/ErrorBoundary.jsx`

```jsx
import React from 'react';
import { handleComponentError } from './ErrorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    handleComponentError(error, 'ErrorBoundary', 'componentDidCatch', {
      additionalData: { errorInfo, componentStack: errorInfo.componentStack }
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Usage Patterns

#### 1. Wrapping Route Components
```jsx
// In main app routing
<ErrorBoundary fallback={<AdminErrorFallback />}>
  <AdminRoute />
</ErrorBoundary>
```

#### 2. Protecting Critical Components
```jsx
// Around data-heavy components
<ErrorBoundary fallback={<DataLoadingError onRetry={refetch} />}>
  <UserDataTable />
</ErrorBoundary>
```

#### 3. Plugin Component Protection
```jsx
// Protecting plugin components
<ErrorBoundary fallback={<PluginErrorFallback pluginName="yourPlugin" />}>
  <YourPluginComponent />
</ErrorBoundary>
```

### Custom Fallback Components

#### Admin Error Fallback
```jsx
const AdminErrorFallback = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-4">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">
          Admin Panel Error
        </h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        An error occurred in the admin panel. This has been automatically reported.
      </p>
      <div className="flex space-x-3">
        <button
          onClick={() => window.location.href = '/admin'}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Return to Dashboard
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);
```

### Error Boundary Benefits

1. **Graceful Degradation**: Prevents entire app crashes from component errors
2. **User Experience**: Provides clear error messages and recovery options
3. **Automatic Logging**: Integrates with error handling utilities for comprehensive logging
4. **Development Debugging**: Preserves error information for debugging in development

## WebSocket Error Resilience

Enhanced WebSocket connection management provides robust error handling and React StrictMode compatibility.

### Connection Management

Location: `/frontend/src/Includes/WebSocketClient.js`

```javascript
let isConnecting = false;
let wsInstance = null;

export const initWebSocket = (tabId, onMessage, onOpen, onClose) => {
  // Prevent duplicate connections in StrictMode
  if (isConnecting) {
    return wsInstance;
  }

  try {
    isConnecting = true;

    // Safe connection establishment
    wsInstance = new WebSocket(`ws://localhost:8081?tabId=${tabId}`);

    wsInstance.onopen = (event) => {
      console.log('WebSocket connected');
      isConnecting = false;
      if (onOpen) onOpen(event);
    };

    wsInstance.onmessage = onMessage;

    wsInstance.onclose = (event) => {
      console.log('WebSocket disconnected');
      isConnecting = false;
      if (onClose) onClose(event);
    };

    wsInstance.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnecting = false;
    };

    return wsInstance;
  } catch (error) {
    console.error('Failed to initialize WebSocket:', error);
    isConnecting = false;
    return null;
  }
};

export const closeWebSocket = () => {
  if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
    wsInstance.close();
    wsInstance = null;
  }
  isConnecting = false;
};
```

### StrictMode Compatibility

React StrictMode in development mode causes components to mount twice, which can lead to duplicate WebSocket connections. The enhanced WebSocket client handles this by:

1. **Connection Guards**: Preventing duplicate connections with `isConnecting` flag
2. **Safe Error Handling**: Graceful handling of connection failures
3. **Cleanup Functions**: Proper cleanup in useEffect return functions

### Usage in Components

```jsx
import { initWebSocket, closeWebSocket } from '../Includes/WebSocketClient';

const MyComponent = () => {
  useEffect(() => {
    const ws = initWebSocket(
      tabId,
      handleMessage,
      handleOpen,
      handleClose
    );

    // Cleanup function for StrictMode compatibility
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        closeWebSocket();
      }
    };
  }, [tabId]);
};
```

## Job System Integration

The error handling system integrates with the PhraseWorks job system for background task error management.

### Job Error Handling

```javascript
// In job processors
import { handleError } from '../utils/errorHandler.js';

export const processEmailJob = async (jobData) => {
  try {
    await sendEmail(jobData.recipient, jobData.content);
    return { success: true };
  } catch (error) {
    await handleError(error, 'EmailJob.processEmailJob', {
      additionalData: { jobId: jobData.id, recipient: jobData.recipient }
    });
    return { success: false, error: error.message };
  }
};
```

### Real-time Error Notifications

WebSocket integration provides real-time error notifications for background jobs:

```javascript
// Job error broadcasting
if (jobResult.success === false) {
  broadcastToAdmins('job_error', {
    jobId: job.id,
    type: job.type,
    error: jobResult.error,
    timestamp: new Date().toISOString()
  });
}
```

## Migration Guide

### From APILogError to New Error Handling

**Before:**
```javascript
try {
  await operation();
} catch (err) {
  await APILogError(err.stack || String(err));
  console.error('Operation failed:', err);
}
```

**After:**
```javascript
try {
  await operation();
} catch (err) {
  await handleComponentError(err, 'ComponentName', 'operationName');
}
```

### Adding Error Boundaries to Existing Code

1. **Identify Critical Components**: Components that handle data fetching, user input, or complex rendering
2. **Wrap with Error Boundaries**: Add `<ErrorBoundary>` wrapper around these components
3. **Create Custom Fallbacks**: Design appropriate fallback UIs for different contexts
4. **Test Error Scenarios**: Verify error boundaries work correctly in development

### WebSocket Connection Updates

Update existing WebSocket usage to use the new resilient client:

**Before:**
```javascript
const ws = new WebSocket('ws://localhost:8081');
```

**After:**
```javascript
const ws = initWebSocket(tabId, onMessage, onOpen, onClose);
// With proper cleanup in useEffect
```