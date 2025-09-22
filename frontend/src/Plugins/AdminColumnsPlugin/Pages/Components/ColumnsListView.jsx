import React from 'react';
import { Link } from 'react-router-dom';

const ColumnsListView = ({
  selectedIds,
  toggleCheckbox,
  allSelected,
  toggleAllCheckboxes,
  dbColumns,
}) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAllCheckboxes}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            />
          </th>
          <th scope="col">Post Type</th>
          <th scope="col">Fields</th>
        </tr>
      </thead>
      <tbody>
        {dbColumns.map((col, idx) => (
          <tr key={idx}>
            <td scope="row" className="table-checkbox-cell">
              <input
                id="default-checkbox"
                type="checkbox"
                value={col.id}
                checked={selectedIds.includes(col.id)}
                onChange={() => toggleCheckbox(col.id)}
                className="checkbox"
              />
            </td>

            <td>
              <Link
                to={`/admin/admin-columns/edit/${col.id}`}
                className="text-blue-700 font-bold hover:underline hover:underline-offset-4"
              >
                {col.postType}
              </Link>
            </td>
            <td>{col.fields.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ColumnsListView;
