import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Form from '../../Shortcodes/Form';

const PopupWindow = ({ onClose, children, title }) => {
  const containerEl = useRef(document.createElement('div'));
  const [externalWindow, setExternalWindow] = useState(null);

  useEffect(() => {
    const newWindow = window.open('', '', 'width=600,height=400,resizable,scrollbars');
    setExternalWindow(newWindow);
    newWindow.document.title = `${title} - Form`;

    Array.from(document.styleSheets).forEach((styleSheet) => {
      if (styleSheet.href) {
        const newLinkEl = document.createElement('link');
        newLinkEl.rel = 'stylesheet';
        newLinkEl.href = styleSheet.href;
        newWindow.document.head.appendChild(newLinkEl);
      } else if (styleSheet.ownerNode && styleSheet.ownerNode.tagName === 'STYLE') {
        const newStyleEl = document.createElement('style');
        newStyleEl.textContent = styleSheet.ownerNode.textContent;
        newWindow.document.head.appendChild(newStyleEl);
      }
    });

    newWindow.document.body.appendChild(containerEl.current);

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
            <h1>Form Preview</h1>
            <Form id={formId} title="true" />
            <button onClick={() => setIsOpen(false)}>Close Preview</button>
          </div>
        </PopupWindow>
      )}
    </>
  );
}
