import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { APILogError } from '../../../API/APISystem';
import { createSafeMarkup } from '@/Utils/sanitizeHtml';

const Document = ({ activeTab, items }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const loadMarkdown = async () => {
      const parentItem = items.find((item) =>
        item.items?.some((subItem) => subItem.slug === activeTab),
      );
      const currentItem = parentItem?.items.find((subItem) => subItem.slug === activeTab);

      if (currentItem?.mdfile) {
        try {
          const response = await fetch(`/docs/${currentItem.mdfile}.md`);
          const text = await response.text();
          setHtmlContent(marked(text));
        } catch (err) {
          await APILogError(err.stack || String(err));
          console.error('Failed to load Markdown file:', err);
          setHtmlContent('<p>Error loading content.</p>');
        }
      }
    };

    loadMarkdown();
  }, [activeTab, items]);

  return (
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
          /* Add spacing between doc elements */
          .prose p {
            margin-bottom: 1rem;
          }
          .prose ul,
          .prose ol {
            margin-bottom: 1rem;
          }
          .prose h1,
          .prose h2,
          .prose h3,
          .prose h4,
          .prose h5,
          .prose h6 {
            margin-bottom: 0.75rem;
          }
        `}</style>
      <div
        className="prose [&>*:first-child]:mt-0 max-w-full"
        dangerouslySetInnerHTML={createSafeMarkup(htmlContent)}
      />
    </div>
  );
};

export default Document;
