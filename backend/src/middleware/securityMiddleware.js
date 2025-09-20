/**
 * Security middleware for adding security headers and protections
 *
 * @param {Object} c - Hono context
 * @param {Function} next - Next middleware function
 */
export const securityMiddleware = async (c, next) => {
  await next();

  // Security headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Only add HSTS in production with HTTPS
  if (process.env.NODE_ENV === 'production' && c.req.header('x-forwarded-proto') === 'https') {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // CSP for admin routes (more restrictive)
  if (c.req.path.startsWith('/admin') || c.req.path.startsWith('/graphql')) {
    c.header('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' ws: wss:; " +
      "frame-ancestors 'none';"
    );
  }
};

/**
 * Request timeout middleware
 *
 * @param {number} timeoutMs - Timeout in milliseconds (default 30 seconds)
 */
export const timeoutMiddleware = (timeoutMs = 30000) => {
  return async (c, next) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, timeoutMs);
    });

    try {
      await Promise.race([next(), timeoutPromise]);
    } catch (error) {
      if (error.message === 'Request timeout') {
        return c.json({
          error: 'Request timeout',
          code: 'TIMEOUT',
          message: 'The request took too long to process'
        }, 408);
      }
      throw error;
    }
  };
};

/**
 * Request size limiting middleware
 *
 * @param {number} maxSize - Maximum request size in bytes (default 10MB)
 */
export const requestSizeMiddleware = (maxSize = 10 * 1024 * 1024) => {
  return async (c, next) => {
    const contentLength = c.req.header('content-length');

    if (contentLength && parseInt(contentLength) > maxSize) {
      return c.json({
        error: 'Request too large',
        code: 'REQUEST_TOO_LARGE',
        message: `Request size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
      }, 413);
    }

    await next();
  };
};