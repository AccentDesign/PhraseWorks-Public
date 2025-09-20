import React from 'react';

const Filter = ({ setFilter, totalGroups, filter, groups }) => {
  return (
    <div className="filter-panel">
      <button
        type="button"
        onClick={() => setFilter('all')}
        className={`text-sm ${filter == 'all' ? 'text-black font-bold' : 'text-blue-800'}`}
      >
        All <span className="font-normal">({totalGroups})</span>
      </button>
      {groups.filter((group) => group.status == 'trash').length > 0 && (
        <button
          type="button"
          onClick={() => setFilter('trash')}
          className={`text-sm ${filter == 'trash' ? 'text-black font-bold' : 'text-red-800'}`}
        >
          Trash{' '}
          <span className="font-normal">
            ({groups.filter((group) => group.status == 'trash').length})
          </span>
        </button>
      )}
    </div>
  );
};

export default Filter;
