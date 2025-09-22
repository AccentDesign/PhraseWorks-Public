import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Accordion from '../../Shortcodes/Accordion'; // import your Form component

const PopupWindow = ({ onClose, children, title }) => {
  const containerEl = useRef(document.createElement('div'));
  const [externalWindow, setExternalWindow] = useState(null);

  useEffect(() => {
    const newWindow = window.open('', '', 'width=600,height=400,resizable,scrollbars');
    setExternalWindow(newWindow);
    newWindow.document.title = `Accordion`;

    // Clone all stylesheets (including Tailwind) from parent document into popup window
    Array.from(document.styleSheets).forEach((styleSheet) => {
      if (styleSheet.href) {
        // It's a linked stylesheet (like Tailwind CSS)
        const newLinkEl = document.createElement('link');
        newLinkEl.rel = 'stylesheet';
        newLinkEl.href = styleSheet.href;
        newWindow.document.head.appendChild(newLinkEl);
      } else if (styleSheet.ownerNode && styleSheet.ownerNode.tagName === 'STYLE') {
        // It's a <style> tag with inline styles, clone it too
        const newStyleEl = document.createElement('style');
        newStyleEl.textContent = styleSheet.ownerNode.textContent;
        newWindow.document.head.appendChild(newStyleEl);
      }
    });

    // Append container div to body of new window
    newWindow.document.body.appendChild(containerEl.current);

    // Cleanup handler...
    const cleanup = () => {
      if (newWindow) newWindow.close();
      if (onClose) onClose();
    };

    newWindow.addEventListener('beforeunload', cleanup);

    return () => {
      newWindow.removeEventListener('beforeunload', cleanup);
      if (!newWindow.closed) newWindow.close();
    };
  }, [onClose]);

  if (!externalWindow) return null;

  return ReactDOM.createPortal(children, containerEl.current);
};

export default function PreviewButton({ formId, title }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button className="link-blue-xs" onClick={() => setIsOpen(true)}>
        Preview
      </button>

      {isOpen && (
        <PopupWindow onClose={() => setIsOpen(false)} title={title}>
          <div style={{ padding: 20 }}>
            <h1>Accordion Preview</h1>
            <Accordion id={formId} overrideActive={true} />
            <button onClick={() => setIsOpen(false)}>Close Preview</button>
          </div>
        </PopupWindow>
      )}
    </>
  );
}
