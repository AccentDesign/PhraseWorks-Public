import React from 'react';
import { marked } from 'marked';
import helpText from '/docs/help.md?raw';
import { createSafeMarkup } from '@/Utils/sanitizeHtml';

const HelpPageContent = () => {
  const htmlContent = marked(helpText);

  return (
    <div className="panel max-w-full">
      <h1 className="text-2xl font-bold mb-8">Help</h1>
      <div className="prose max-w-full">
        <style>{`
          pre,
          code {
            white-space: pre-wrap !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          pre {
            max-width: 100%;
            overflow-x: auto;
            padding: 1em;
            margin: 0;
            border-radius: 0.3em;
            background: #f5f5f5; /* Fallback background */
          }
          code {
            font-family: 'Fira Code', monospace;
            padding: 0.2em 0.4em;
            border-radius: 0.2em;
          }
          pre code {
            background: none;
            padding: 0;
          }
          /* Ensure prose and highlight.js don't override wrapping */
          .prose pre,
          .prose code,
          .prose pre.hljs,
          .prose code.hljs {
            white-space: pre-wrap !important;
            word-break: break-word !important;
          }
        `}</style>
        <div className="prose max-w-full" dangerouslySetInnerHTML={createSafeMarkup(htmlContent)} />
      </div>
    </div>
  );
};

export default HelpPageContent;
