import React from 'react';

const BulkActions = ({ bulkAction, setBulkAction, handleApply, filter }) => {
  return (
    <div className="actions-panel">
      <select
        id="actionsDropdown"
        className="select"
        value={bulkAction}
        onChange={(e) => setBulkAction(e.target.value)}
      >
        <option value="">Bulk Actions</option>
        {filter != 'trash' ? (
          <option value="trash">Trash Items</option>
        ) : (
          <>
            <option value="delete">Delete Permanently</option>
            <option value="restore">Restore</option>
          </>
        )}
      </select>
      <button
        type="button"
        className="ml-4 text-white bg-blue-700 hover:bg-blue-800 btn"
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

export default BulkActions;
