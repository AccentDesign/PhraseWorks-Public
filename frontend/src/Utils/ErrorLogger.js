/**
 * Error logging service for PhraseWorks
 * Provides centralized error logging and reporting
 */

import { APILogError } from '../API/APISystem';

class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxStoredErrors = 50;
    this.setupGlobalErrorHandlers();
  }

  /**
   * Set up global error handlers for unhandled errors
   */
  setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        new Error(`Unhandled promise rejection: ${event.reason}`),
        { type: 'unhandledrejection', reason: event.reason },
        'Global'
      );
    });

    // Handle general JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(
        new Error(`Global error: ${event.message}`),
        {
          type: 'global',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        },
        'Global'
      );
    });
  }

  /**
   * Log an error to the service
   * @param {Error} error - The error object
   * @param {Object} errorInfo - Additional error information
   * @param {string} context - Context where error occurred
   */
  async logError(error, errorInfo = {}, context = 'Unknown') {
    const errorEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    };

    // Store locally
    this.errors.unshift(errorEntry);
    if (this.errors.length > this.maxStoredErrors) {
      this.errors = this.errors.slice(0, this.maxStoredErrors);
    }

    // Save to localStorage for persistence
    try {
      localStorage.setItem('pw_error_log', JSON.stringify(this.errors.slice(0, 10)));
    } catch (e) {
      console.warn('Failed to save error log to localStorage:', e);
    }

    // Log to console in development
    if (import.meta.env.MODE === 'development') {
      console.group(`🚨 Error logged: ${context}`);
      console.error('Error:', error);
      console.log('Error Info:', errorInfo);
      console.log('Full Entry:', errorEntry);
      console.groupEnd();
    }

    // Send to backend
    try {
      await APILogError(JSON.stringify(errorEntry));
    } catch (e) {
      console.warn('Failed to send error to backend:', e);
    }

    // Trigger custom event for error monitoring
    window.dispatchEvent(new CustomEvent('pw:error', {
      detail: errorEntry
    }));

    return errorEntry;
  }

  /**
   * Get the current user ID if available
   */
  getCurrentUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.ID || null;
    } catch {
      return null;
    }
  }

  /**
   * Get or create a session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('pw_session_id');
    if (!sessionId) {
      sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('pw_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get all stored errors
   */
  getErrors() {
    return [...this.errors];
  }

  /**
   * Clear all stored errors
   */
  clearErrors() {
    this.errors = [];
    localStorage.removeItem('pw_error_log');
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    const recentErrors = this.errors.filter(
      error => now - new Date(error.timestamp).getTime() < oneHour
    );

    const todayErrors = this.errors.filter(
      error => now - new Date(error.timestamp).getTime() < oneDay
    );

    const contextStats = this.errors.reduce((acc, error) => {
      acc[error.context] = (acc[error.context] || 0) + 1;
      return acc;
    }, {});

    return {
      total: this.errors.length,
      lastHour: recentErrors.length,
      today: todayErrors.length,
      byContext: contextStats
    };
  }

  /**
   * Export errors for debugging
   */
  exportErrors() {
    const data = {
      errors: this.errors,
      stats: this.getErrorStats(),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pw-errors-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Create global instance
const errorLogger = new ErrorLogger();

// Make it available globally for error boundaries
window.pwErrorLogger = errorLogger;

export default errorLogger;