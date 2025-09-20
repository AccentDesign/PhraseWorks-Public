import React from 'react';
import { Link } from 'react-router-dom';

const ListView = ({
  tags,
  selectedIds,
  toggleCheckbox,
  allSelected,
  toggleAllCheckboxes,
  setTagToEdit,
  setEditTagSliderOpen,
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
            Description
          </th>
          <th scope="col" className="px-6 py-3">
            Slug
          </th>
          <th scope="col" className="px-6 py-3">
            Count
          </th>
        </tr>
      </thead>
      <tbody>
        {tags.map((tag, idx) => (
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
                value={tag.term_id}
                checked={selectedIds.includes(tag.term_id)}
                onChange={() => toggleCheckbox(tag.term_id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
            </th>

            <td className="px-6 py-4">
              <button
                type="button"
                className="text-blue-800 hover:text-blue-500"
                onClick={() => {
                  setTagToEdit(tag);
                  setEditTagSliderOpen(true);
                }}
              >
                {tag.name}
              </button>
            </td>
            <td className="px-6 py-4">{tag.description}</td>
            <td className="px-6 py-4">{tag.slug}</td>
            <td className="px-6 py-4">{tag.post_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
