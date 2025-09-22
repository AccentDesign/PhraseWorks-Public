import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { UserContextProvider } from '@/Contexts/UserContext';
import { APIConnectorContextProvider } from '@/Contexts/APIConnectorContext';
import { Link, useLocation } from 'react-router-dom';
import { notify } from '@/Utils/Notification';
import { useState } from 'react';
import { useEffect } from 'react';
import { APIGetGForm } from '../../../API/APIForms';
import Preview from './Preview';
import { MemoryRouter } from 'react-router-dom';
import { APILogError } from '../../../../../API/APISystem';

const PageHeader = ({
  formTitle,
  setFormTitle,
  saveForm,
  formId,
  selectedField,
  setSelectedField,
}) => {
  const { pathname } = useLocation();
  const [formFields, setFormFields] = useState([]);
  const [pageComponent, setPageComponent] = useState(null);
  const settingsMatch = pathname.includes('/admin/zero-g/form_settings/');
  const entriesMatch = pathname.includes('/admin/zero-g/form_entries/');

  const mockPageData = {
    fields: formFields,
  };

  const fetchData = async () => {
    const data = await APIGetGForm(formId);
    if (data.status == 200) {
      if (data.data.getGForm) {
        setFormFields(data.data.getGForm.fields.fields);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPreview = (pageData) => {
    const popup = window.open('', '', 'width=800,height=600');
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>Preview</title>
          <link rel="stylesheet" href="/path/to/tailwind.css" />
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
    popup.document.close();

    popup.onload = async () => {
      const root = ReactDOM.createRoot(popup.document.getElementById('root'));

      for (const styleSheet of Array.from(document.styleSheets)) {
        try {
          if (styleSheet.href) {
            const link = popup.document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            popup.document.head.appendChild(link);
          } else if (styleSheet.cssRules) {
            const style = popup.document.createElement('style');
            let css = '';
            for (const rule of styleSheet.cssRules) {
              css += rule.cssText;
            }
            style.textContent = css;
            popup.document.head.appendChild(style);
          }
        } catch (err) {
          await APILogError(err.stack || String(err));
          console.warn('Could not access stylesheet:', err);
        }
      }

      root.render(
        <HelmetProvider>
          <APIConnectorContextProvider>
            <UserContextProvider>
              <MemoryRouter>
                <Preview fields={formFields} formTitle={formTitle} />
              </MemoryRouter>
            </UserContextProvider>
          </APIConnectorContextProvider>
        </HelmetProvider>,
      );
    };
  };

  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-300">
      <div className="flex flex-row items-center">
        <div className="px-4 py-2 flex flex-row items-center">
          Form:{' '}
          <input
            type="text"
            placeholder="Form Title"
            className="border px-2 py-1 ml-2 rounded w-full"
            onChange={(e) => setFormTitle(e.target.value)}
            value={formTitle}
          />
        </div>
        {formId != null && (
          <>
            {(settingsMatch == true || entriesMatch == true) && (
              <div className="">
                <Link
                  to={`/admin/zero-g/edit/${formId}`}
                  className="p-4 border-r border-l border-gray-300 hover:bg-gray-200 text-gray-500"
                >
                  Edit
                </Link>
              </div>
            )}
            {settingsMatch == false && (
              <div className="">
                <Link
                  to={`/admin/zero-g/form_settings/${formId}`}
                  className="p-4 border-r border-l border-gray-300 hover:bg-gray-200 text-gray-500"
                >
                  Settings
                </Link>
              </div>
            )}
            {entriesMatch == false && (
              <div className="">
                <Link
                  to={`/admin/zero-g/form_entries/${formId}`}
                  className="p-4 border-r border-gray-300 hover:bg-gray-200 text-gray-500"
                >
                  Entries
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex flex-row items-center">
        <div className="">
          <button
            className="p-4 border-r border-l border-gray-300 hover:bg-gray-200 text-gray-500"
            onClick={() => {
              navigator.clipboard.writeText(`[zerogform id="${formId}" title="true"]`);
              notify('Successfully copied shortcode to your clipboard', 'success');
            }}
          >
            Copy Shortcode
          </button>
        </div>
        <div className="">
          <button
            className="p-4 border-r border-gray-300 hover:bg-gray-200 text-gray-500"
            onClick={() => openPreview(mockPageData)}
          >
            Preview Changes
          </button>
        </div>
        <div className="">
          <button
            className="bg-blue-800 hover:bg-blue-600 text-white p-4 flex flex-row items-center gap-3"
            onClick={(e) => {
              e.preventDefault;
              saveForm();
            }}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4"
            >
              <path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path>
            </svg>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
