import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const Content = ({
  activeContentTab,
  setActiveContentTab,
  content,
  HandleContentEditorChange,
  HandleContentChange,
}) => {
  return (
    <div className="my-4">
      <div className="flex flex-row justify-end items-center">
        <div className="flex justify-end border-b border-gray-200">
          <button
            className={`px-4 py-2 ${
              activeContentTab === 'visual'
                ? 'border-b-4 border-blue-500 text-blue-500'
                : 'text-gray-800 font-medium'
            }`}
            onClick={() => setActiveContentTab('visual')}
          >
            Visual
          </button>
          <button
            className={`px-4 py-2 ${
              activeContentTab === 'text'
                ? 'border-b-4 border-blue-500 text-blue-500'
                : 'text-gray-800 font-medium'
            }`}
            onClick={() => setActiveContentTab('text')}
          >
            Text
          </button>
        </div>
      </div>
      <div className="mt-4">
        {activeContentTab === 'visual' && (
          <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            license_key="gpl"
            value={content}
            init={{
              height: 500,
              menubar: true,
              plugins: 'advlist link image lists',
              toolbar:
                'undo redo | styles | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help',
              branding: false,
              script_url: '/tinymce/tinymce.min.js',
            }}
            onEditorChange={HandleContentEditorChange}
          />
        )}
        {activeContentTab === 'text' && (
          <textarea
            value={content}
            onChange={HandleContentChange}
            className="w-full h-64 p-2 mt-4 border border-gray-300 rounded font-mono text-sm"
            placeholder="Enter HTML content here..."
          />
        )}
      </div>
    </div>
  );
};

export default Content;
