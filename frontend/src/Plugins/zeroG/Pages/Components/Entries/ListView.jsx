import React from 'react';
import { Link } from 'react-router-dom';

const ListView = ({
  entries,
  selectedIds,
  toggleCheckbox,
  allSelected,
  toggleAllCheckboxes,
  form,
}) => {
  const firstFiveFieldsObject = form?.fields?.fields
    ? Object.fromEntries(form.fields.fields.slice(0, 3).map((field) => [field.id, field.label]))
    : {};
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
          {Object.entries(firstFiveFieldsObject).map(([id, label]) => {
            return <th key={id}>{label}</th>;
          })}
          <th className="text-right pr-4">Created Date</th>
        </tr>
      </thead>
      <tbody>
        {entries.length > 0 ? (
          <>
            {entries.map((entry, idx) => (
              <tr key={idx}>
                <td scope="row" className="table-checkbox-cell">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value={entry.id}
                    checked={selectedIds.includes(entry.id)}
                    onChange={() => toggleCheckbox(entry.id)}
                    className="checkbox"
                  />
                </td>
                {Object.entries(firstFiveFieldsObject).map(([id, label]) => {
                  const data = JSON.parse(entry.data);
                  return (
                    <td key={id}>
                      <Link
                        to={`/admin/zero-g/form_entry/${form.id}/${entry.id}`}
                        className="text-blue-500 font-bold hover:text-blue-700"
                      >
                        {data[id]}
                      </Link>
                    </td>
                  );
                })}
                <td className="text-right pr-4">
                  {new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'full',
                  }).format(new Date(entry.date_created))}
                </td>
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td colSpan="4">No Submissions</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ListView;
