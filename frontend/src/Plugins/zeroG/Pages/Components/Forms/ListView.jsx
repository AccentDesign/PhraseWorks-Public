import React from 'react';
import { Link } from 'react-router-dom';
import PreviewButton from '../PopupWindow';

const ListView = ({
  forms,
  selectedIds,
  toggleCheckbox,
  activateForm,
  deactivateForm,
  restoreForm,
  binForm,
  permanentDelete,
  allSelected,
  toggleAllCheckboxes,
  updateFormActive,
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
          <th scope="col">Status</th>
          <th scope="col">Title</th>
          <th scope="col">ID</th>
          <th scope="col">Entries</th>
          <th scope="col">Views</th>
          <th scope="col">Conversion</th>
        </tr>
      </thead>
      <tbody>
        {forms.map((form, idx) => (
          <tr key={idx}>
            <td scope="row" className="table-checkbox-cell">
              <input
                id="default-checkbox"
                type="checkbox"
                value={form.id}
                checked={selectedIds.includes(form.id)}
                onChange={() => toggleCheckbox(form.id)}
                className="checkbox"
              />
            </td>
            <td className="w-[80px]">
              {form.status == 'inactive' ? (
                <div className="bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full border border-gray-300 flex flex-row items-center gap-[2px]">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="30" fill="currentColor" />
                  </svg>
                  <span>Inactive</span>
                </div>
              ) : form.status == 'active' ? (
                <div className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full border border-green-400 flex flex-row items-center gap-[2px]">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="30" fill="currentColor" />
                  </svg>
                  <span>Active</span>
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full border border-red-800 flex flex-row items-center gap-[2px]">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="30" fill="currentColor" />
                  </svg>
                  <span>Trash</span>
                </div>
              )}
            </td>
            <td className="flex flex-col">
              <div className="flex flex-row items-center">
                <Link to={`/admin/zero-g/edit/${form.id}`} className="text-blue-700 font-bold">
                  {form.title}
                </Link>
              </div>
              <div className="flex flex-row items-center gap-4">
                {form.status == 'trash' ? (
                  <>
                    <p>
                      <button className="link-blue-xs" onClick={() => restoreForm(form.id)}>
                        Restore
                      </button>
                    </p>
                    <p>
                      <button className="link-red-xs" onClick={() => permanentDelete(form.id)}>
                        Permanently Delete
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    {form.status != 'active' && (
                      <p>
                        <button
                          className="link-blue-xs"
                          onClick={() => {
                            updateFormActive(form.id, true);
                          }}
                        >
                          Activate
                        </button>
                      </p>
                    )}
                    {form.status != 'inactive' && (
                      <p>
                        <button
                          className="link-blue-xs"
                          onClick={() => {
                            updateFormActive(form.id, false);
                          }}
                        >
                          Deactivate
                        </button>
                      </p>
                    )}
                    <p>
                      <Link to={`/admin/zero-g/form_settings/${form.id}`} className="link-blue-xs">
                        Settings
                      </Link>
                    </p>
                    <p>
                      <Link to={`/admin/zero-g/form_entries/${form.id}`} className="link-blue-xs">
                        Entries
                      </Link>
                    </p>
                    <PreviewButton formId={form.id} title={form.title} />
                    <p>
                      <button
                        className="link-red-xs"
                        onClick={() => {
                          binForm(form.id);
                        }}
                      >
                        Permanently Delete
                      </button>
                    </p>
                  </>
                )}
              </div>
            </td>
            <td>{form.id}</td>
            <td>{form.entries}</td>
            <td>{form.views}</td>
            <td>{form.conversion.toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
