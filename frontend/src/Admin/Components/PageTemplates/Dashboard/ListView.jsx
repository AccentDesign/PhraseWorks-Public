import React from 'react';
import { Link } from 'react-router-dom';

const ListView = ({
  pageTemplates,
  selectedIds,
  toggleCheckbox,
  allSelected,
  toggleAllCheckboxes,
  setTemplateToEdit,
  setEditSliderOpen,
}) => {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
        <tr>
          <th scope="col" className="px-6 py-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAllCheckboxes}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            />
          </th>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            FileName
          </th>
        </tr>
      </thead>
      <tbody>
        {pageTemplates.map((template, idx) => (
          <tr
            key={idx}
            className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
          >
            <th
              scope="row"
              className="px-6 py-4 w-[40px] font-medium text-gray-900 whitespace-nowrap"
            >
              <input
                id="default-checkbox"
                type="checkbox"
                value={template.id}
                checked={selectedIds.includes(template.id)}
                onChange={() => toggleCheckbox(template.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
            </th>
            <td className="px-6 py-4">
              <button
                type="button"
                className="text-blue-800 hover:text-blue-500"
                onClick={() => {
                  setTemplateToEdit(template);
                  setEditSliderOpen(true);
                }}
              >
                {template.name}
              </button>
            </td>
            <td className="px-6 py-4">{template.file_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
