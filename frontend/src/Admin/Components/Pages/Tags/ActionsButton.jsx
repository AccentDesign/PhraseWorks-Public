import React from 'react';

const ActionsButton = ({ bulkAction, setBulkAction, handleApply }) => {
  return (
    <div className="flex flex-row items-center my-4">
      <select
        id="actionsDropdown"
        className="bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        value={bulkAction}
        onChange={(e) => setBulkAction(e.target.value)}
      >
        <option value="">Bulk Actions</option>
        <option value="delete">Delete Permanently</option>
      </select>
      <button
        type="button"
        className="ml-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
        onClick={handleApply}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 mr-2 -ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          />
        </svg>
        Apply
      </button>
    </div>
  );
};

export default ActionsButton;
