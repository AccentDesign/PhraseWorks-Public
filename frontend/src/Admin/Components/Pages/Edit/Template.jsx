import React, { useContext } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';
import { APIUpdatePageTemplateId } from '../../../../API/APIPageTemplates';

const Template = ({ templates, templateId, setTemplateId, postId, setReloadPost }) => {
  const { loginPassword } = useContext(APIConnectorContext);

  const updateTemplate = async () => {
    const data = await APIUpdatePageTemplateId(loginPassword, templateId, postId);
    if (data.status == 200) {
      if (data.data.updatePageTemplateId.success == true) {
        setReloadPost(true);
        notify(`Successfully updated page template`, `success`);
        return;
      }
    }
    notify(`Failed to update page template`, `error`);
  };

  return (
    <div className="panel mt-8">
      <h3 className="font-bold text-lg">Page Template</h3>
      <hr className="my-4" />
      <div className="flex flex-col gap-2 items-start mt-4 rounded  border border-gray-300 p-4">
        <select
          name="status"
          className="py-4 bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow w-full"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
        >
          <option value={-1}>Default</option>
          {templates.map((template, idx) => (
            <option key={idx} value={template.id}>
              {template.name} - {template.file_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-row justify-start">
        <button type="button" className="mt-4 secondary-btn" onClick={() => updateTemplate()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
              clipRule="evenodd"
            />
          </svg>
          Update Template
        </button>
      </div>
    </div>
  );
};

export default Template;
