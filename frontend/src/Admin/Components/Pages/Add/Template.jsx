import React from 'react';

const Template = ({ templates, templateId, setTemplateId }) => {
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
    </div>
  );
};

export default Template;
