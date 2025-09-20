import { handleError } from '../utils/errorHandler.js';

/**
 * GraphQL Query Depth Limiter
 * Prevents deeply nested queries that could cause performance issues
 */
function analyzeQueryDepth(query, maxDepth = 10) {
  let depth = 0;
  let maxFound = 0;

  const tokens = query.replace(/\s+/g, ' ').split(' ');

  for (const token of tokens) {
    if (token.includes('{')) {
      depth += (token.match(/\{/g) || []).length;
      maxFound = Math.max(maxFound, depth);
    }
    if (token.includes('}')) {
      depth -= (token.match(/\}/g) || []).length;
    }
  }

  return maxFound;
}

/**
 * GraphQL Query Complexity Analyzer
 * Basic complexity analysis based on field count and nesting
 */
function analyzeQueryComplexity(query, maxComplexity = 100) {
  // Count fields, nested objects, and arrays
  const fieldCount = (query.match(/\w+\s*(?:\(.*?\))?\s*{/g) || []).length;
  const selectionCount = (query.match(/\w+(?![({])/g) || []).length;
  const argumentCount = (query.match(/\(/g) || []).length;

  // Simple complexity calculation
  const complexity = fieldCount * 2 + selectionCount + argumentCount * 0.5;

  return complexity;
}

/**
 * Input Sanitization
 * Clean and validate input strings
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  // Remove potentially dangerous characters but preserve normal content
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/script:/gi, '') // Remove script: protocols
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols (be careful with this in some contexts)
    .trim();
}

/**
 * Recursively sanitize object inputs
 */
function sanitizeVariables(variables) {
  if (!variables || typeof variables !== 'object') return variables;

  if (Array.isArray(variables)) {
    return variables.map(sanitizeVariables);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeVariables(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate file upload inputs
 */
function validateFileUploads(variables) {
  const errors = [];

  function checkFileInput(obj, path = '') {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (value && typeof value === 'object') {
        // Check if it looks like a file upload object
        if (value.filename && value.type && value.data) {
          // Validate file type
          const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'application/pdf', 'text/plain', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ];

          if (!allowedTypes.includes(value.type)) {
            errors.push(`Invalid file type at ${currentPath}: ${value.type}`);
          }

          // Validate filename
          if (!/^[a-zA-Z0-9._-]+$/.test(value.filename.replace(/\.[^.]+$/, ''))) {
            errors.push(`Invalid filename at ${currentPath}: ${value.filename}`);
          }

          // Check file size (base64 encoded size approximation)
          if (value.data && value.data.length > 250 * 1024 * 1024 * 1.37) { // ~250MB after base64 encoding
            errors.push(`File too large at ${currentPath}`);
          }
        } else {
          checkFileInput(value, currentPath);
        }
      }
    }
  }

  checkFileInput(variables);
  return errors;
}

/**
 * Rate limiting per operation type
 */
const operationLimits = new Map();
const RATE_LIMITS = {
  mutation: { count: 50, window: 60000 }, // 50 mutations per minute
  query: { count: 200, window: 60000 },   // 200 queries per minute
  subscription: { count: 10, window: 60000 } // 10 subscriptions per minute
};

function checkRateLimit(clientId, operationType) {
  const key = `${clientId}:${operationType}`;
  const now = Date.now();
  const limit = RATE_LIMITS[operationType] || RATE_LIMITS.query;

  if (!operationLimits.has(key)) {
    operationLimits.set(key, { count: 1, firstRequest: now });
    return true;
  }

  const data = operationLimits.get(key);

  // Reset if window has passed
  if (now - data.firstRequest > limit.window) {
    operationLimits.set(key, { count: 1, firstRequest: now });
    return true;
  }

  // Check if limit exceeded
  if (data.count >= limit.count) {
    return false;
  }

  // Increment count
  data.count++;
  return true;
}

/**
 * Main validation middleware
 */
export const validationMiddleware = async (c, next) => {
  try {
    const body = c.get('graphqlBody') || c.get('graphqlOperations');

    if (!body) {
      await next();
      return;
    }

    const { query, variables = {}, operationName } = body;

    if (!query) {
      return c.json({
        errors: [{ message: 'Query is required' }]
      }, 400);
    }

    // Extract operation type
    const operationType = query.trim().toLowerCase().startsWith('mutation') ? 'mutation' :
                         query.trim().toLowerCase().startsWith('subscription') ? 'subscription' : 'query';

    // Rate limiting
    const clientId = c.req.header('x-client-id') || c.get('userId') || 'anonymous';
    if (!checkRateLimit(clientId, operationType)) {
      return c.json({
        errors: [{
          message: 'Rate limit exceeded',
          extensions: { code: 'RATE_LIMIT_EXCEEDED' }
        }]
      }, 429);
    }

    // Query depth validation
    const depth = analyzeQueryDepth(query);
    if (depth > 15) {
      await handleError(
        new Error(`Query depth ${depth} exceeds maximum allowed (15)`),
        'ValidationMiddleware.queryDepth',
        { query: query.substring(0, 200), depth }
      );

      return c.json({
        errors: [{
          message: 'Query too complex',
          extensions: { code: 'QUERY_TOO_DEEP' }
        }]
      }, 400);
    }

    // Query complexity validation
    const complexity = analyzeQueryComplexity(query);
    if (complexity > 200) {
      await handleError(
        new Error(`Query complexity ${complexity} exceeds maximum allowed (200)`),
        'ValidationMiddleware.queryComplexity',
        { query: query.substring(0, 200), complexity }
      );

      return c.json({
        errors: [{
          message: 'Query too complex',
          extensions: { code: 'QUERY_TOO_COMPLEX' }
        }]
      }, 400);
    }

    // Sanitize variables
    const sanitizedVariables = sanitizeVariables(variables);

    // Validate file uploads
    const fileErrors = validateFileUploads(sanitizedVariables);
    if (fileErrors.length > 0) {
      return c.json({
        errors: fileErrors.map(error => ({
          message: error,
          extensions: { code: 'INVALID_FILE_UPLOAD' }
        }))
      }, 400);
    }

    // Update the body with sanitized variables
    const sanitizedBody = { ...body, variables: sanitizedVariables };
    c.set('graphqlBody', sanitizedBody);

    // Log suspicious queries in production
    if (depth > 10 || complexity > 150) {
      await handleError(
        new Error('Suspicious query detected'),
        'ValidationMiddleware.suspiciousQuery',
        {
          query: query.substring(0, 500),
          depth,
          complexity,
          clientId,
          operationType
        }
      );
    }

  } catch (error) {
    await handleError(error, 'ValidationMiddleware.error');
    return c.json({
      errors: [{
        message: 'Validation error',
        extensions: { code: 'VALIDATION_ERROR' }
      }]
    }, 500);
  }

  await next();
};

/**
 * Clean up old rate limit entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of operationLimits.entries()) {
    if (now - data.firstRequest > Math.max(...Object.values(RATE_LIMITS).map(l => l.window))) {
      operationLimits.delete(key);
    }
  }
}, 300000); // Clean up every 5 minutes

export { analyzeQueryDepth, analyzeQueryComplexity, sanitizeInput, sanitizeVariables };