import React, { useRef, useState, useEffect } from 'react';

const pillStyle =
  'inline-flex items-center bg-gray-300 text-gray-800 rounded-full px-2 py-0.5 mr-1 cursor-default select-none';

export default function PillTextArea({ value, setValue, variables }) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);
  const lastValueRef = useRef('');

  const saveSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    selectionRef.current = sel.getRangeAt(0);
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (selectionRef.current) {
      sel.removeAllRanges();
      sel.addRange(selectionRef.current);
    }
  };

  const insertPill = (val) => {
    const el = editorRef.current;
    if (!el) return;

    let range = null;
    if (selectionRef.current && el.contains(selectionRef.current.startContainer)) {
      range = selectionRef.current.cloneRange();
    } else {
      range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
    }

    const sel = window.getSelection();
    if (!sel) return;

    sel.removeAllRanges();
    sel.addRange(range);

    const pill = document.createElement('span');
    pill.textContent = val.name;
    pill.className = 'pill ' + pillStyle;
    pill.setAttribute('data-value', val.value);
    pill.setAttribute('contenteditable', 'false');

    const space = document.createTextNode('\u00A0');

    range.deleteContents();
    range.insertNode(space);
    range.insertNode(pill);

    range.setStartAfter(space);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);

    selectionRef.current = range.cloneRange();

    setShowButtons(false);

    triggerChange();
  };

  const getEditorContent = () => {
    const el = editorRef.current;
    if (!el) return [];
    const result = [];

    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result.push({ type: 'text', value: node.textContent });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('pill')) {
        result.push({ type: 'pill', value: node.getAttribute('data-value') });
      }
    });

    return result;
  };

  const serializeContent = (contentArray) => {
    return contentArray
      .map((part) => (part.type === 'pill' ? `%${part.value.toLowerCase()}%` : part.value))
      .join('');
  };

  const parseValue = (val) => {
    if (!val) return [];
    const regex = /%([^%]+)%/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = regex.exec(val)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: val.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'pill', value: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < val.length) {
      parts.push({ type: 'text', value: val.slice(lastIndex) });
    }
    return parts;
  };

  const renderContent = () => {
    if (!editorRef.current) return;
    const el = editorRef.current;

    const sel = window.getSelection();
    let range = null;
    if (sel && sel.rangeCount > 0) {
      range = sel.getRangeAt(0).cloneRange();
    }

    el.innerHTML = '';
    const content = parseValue(value);

    content.forEach((part) => {
      if (part.type === 'text') {
        el.appendChild(document.createTextNode(part.value));
      } else if (part.type === 'pill') {
        const pill = document.createElement('span');
        pill.className = 'pill ' + pillStyle;
        pill.setAttribute('data-value', part.value);
        pill.setAttribute('contenteditable', 'false');
        pill.textContent = part.value;
        el.appendChild(pill);
        el.appendChild(document.createTextNode('\u00A0'));
      }
    });

    if (range) {
      window.requestAnimationFrame(() => {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      });
    }
  };

  const triggerChange = () => {
    const content = getEditorContent();
    const serialized = serializeContent(content);
    if (serialized !== lastValueRef.current) {
      lastValueRef.current = serialized;
      setValue(serialized);
    }
  };

  const onInput = () => {
    triggerChange();
  };

  useEffect(() => {
    if (value !== lastValueRef.current) {
      lastValueRef.current = value;
      renderContent();
    }
  }, [value]);

  return (
    <div className="w-full mb-4">
      <div className="flex space-x-2">
        <div
          ref={editorRef}
          contentEditable
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onInput={onInput}
          spellCheck={false}
          suppressContentEditableWarning={true}
          className="h-[120px] overflow-y-auto whitespace-pre-wrap input min-h-[40px] focus:outline-none"
          aria-label="Editable input with pills"
        />
        <button
          onClick={() => {
            saveSelection();
            setShowButtons(!showButtons);
          }}
          className="flex-1 min-w-[140px] h-[46px] bg-gray-100 text-red-700 border-gray-300 border hover:bg-gray-300 px-4 rounded"
          type="button"
        >
          Insert Variable
        </button>
      </div>

      {showButtons && (
        <div className="mt-2 p-2 border rounded bg-gray-50 flex space-x-2">
          {variables.map((btn) => (
            <button
              key={btn.value}
              onClick={() => insertPill(btn)}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded "
              type="button"
            >
              {btn.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
