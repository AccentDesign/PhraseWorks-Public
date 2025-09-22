import React from 'react';
import { Link } from 'react-router-dom';
import { notify } from '../../../../../Utils/Notification';

import PreviewButton from '../PopupWindow';

const ListView = ({
  accordions,
  selectedIds,
  toggleCheckbox,
  restoreAccordion,
  binAccordion,
  permanentDelete,
  allSelected,
  toggleAllCheckboxes,
  updateAccordionActive,
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
          <th scope="col">ShortCode</th>
        </tr>
      </thead>
      <tbody>
        {accordions.map((accordion, idx) => (
          <tr key={idx}>
            <td scope="row" className="table-checkbox-cell">
              <input
                id="default-checkbox"
                type="checkbox"
                value={accordion.id}
                checked={selectedIds.includes(accordion.id)}
                onChange={() => toggleCheckbox(accordion.id)}
                className="checkbox"
              />
            </td>
            <td className="w-[80px]">
              {accordion.status == 'inactive' ? (
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
              ) : accordion.status == 'active' ? (
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
                <Link
                  to={`/admin/accordions-plugin/edit/${accordion.id}`}
                  className="text-blue-700 font-bold"
                >
                  {accordion.title}
                </Link>
              </div>
              <div className="flex flex-row items-center gap-4">
                {accordion.status == 'trash' ? (
                  <>
                    <p>
                      <button
                        className="link-blue-xs"
                        onClick={() => restoreAccordion(accordion.id)}
                      >
                        Restore
                      </button>
                    </p>
                    <p>
                      <button className="link-red-xs" onClick={() => permanentDelete(accordion.id)}>
                        Permanently Delete
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    {accordion.status != 'active' && (
                      <p>
                        <button
                          className="link-blue-xs"
                          onClick={() => {
                            updateAccordionActive(accordion.id, true);
                          }}
                        >
                          Activate
                        </button>
                      </p>
                    )}
                    {accordion.status != 'inactive' && (
                      <p>
                        <button
                          className="link-blue-xs"
                          onClick={() => {
                            updateAccordionActive(accordion.id, false);
                          }}
                        >
                          Deactivate
                        </button>
                      </p>
                    )}
                    <PreviewButton formId={accordion.id} />
                    <p>
                      <button
                        className="link-red-xs"
                        onClick={() => {
                          binAccordion(accordion.id);
                        }}
                      >
                        Permanently Delete
                      </button>
                    </p>
                  </>
                )}
              </div>
            </td>
            <td>{accordion.id}</td>
            <td>
              <div className="flex items-center gap-2">
                [accordions id="{accordion.id}"]
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`[accordions id="${accordion.id}"]`);
                    notify('Successfully copied to clipboard', 'success');
                  }}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Copy to clipboard"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="200px"
                    width="200px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                    <path d="M16 4h2a2 2 0 0 1 2 2v4"></path>
                    <path d="M21 14H11"></path>
                    <path d="m15 10-4 4 4 4"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
