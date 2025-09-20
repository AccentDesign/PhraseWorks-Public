import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} html - The HTML content to sanitize
 * @param {Object} options - DOMPurify configuration options
 * @returns {string} - Sanitized HTML content
 */
export const sanitizeHtml = (html, options = {}) => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Default configuration for content that allows basic formatting
  const defaultConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'td', 'th'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id',
      'width', 'height', 'style'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    SAFE_FOR_TEMPLATES: true,
    ...options
  };

  return DOMPurify.sanitize(html, defaultConfig);
};

/**
 * Sanitizes HTML for SVG content (more restrictive)
 * @param {string} svg - The SVG content to sanitize
 * @returns {string} - Sanitized SVG content
 */
export const sanitizeSvg = (svg) => {
  if (!svg || typeof svg !== 'string') {
    return '';
  }

  const svgConfig = {
    ALLOWED_TAGS: ['svg', 'path', 'g', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text'],
    ALLOWED_ATTR: [
      'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width',
      'd', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
      'points', 'class', 'xmlns'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true
  };

  return DOMPurify.sanitize(svg, svgConfig);
};

/**
 * Creates a safe dangerouslySetInnerHTML object
 * @param {string} html - The HTML content to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object} - Object with __html property containing sanitized content
 */
export const createSafeMarkup = (html, options = {}) => ({
  __html: sanitizeHtml(html, options)
});

/**
 * Creates a safe dangerouslySetInnerHTML object for SVG content
 * @param {string} svg - The SVG content to sanitize
 * @returns {Object} - Object with __html property containing sanitized SVG
 */
export const createSafeSvgMarkup = (svg) => ({
  __html: sanitizeSvg(svg)
});