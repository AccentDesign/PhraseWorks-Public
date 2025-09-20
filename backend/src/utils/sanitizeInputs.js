import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return sanitizeHtml(input, {
      allowedTags: [
        'b',
        'i',
        'em',
        'strong',
        'p',
        'ul',
        'ol',
        'li',
        'a',
        'img',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'code',
        'pre',
        'span',
        'div',
        'br',
      ],
      allowedAttributes: {
        a: ['href', 'title', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        span: ['style'],
        div: ['style'],
      },
      allowedStyles: {
        '*': {
          // allow some inline styles
          color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/],
          'text-align': [/^left$/, /^right$/, /^center$/],
          'font-weight': [/^bold$/, /^\d+$/],
          'font-style': [/^italic$/],
        },
      },
    });
  }
  return input;
}
