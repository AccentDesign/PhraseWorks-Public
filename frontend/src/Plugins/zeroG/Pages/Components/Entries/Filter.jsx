import React from 'react';

const Filter = ({ setFilter, totalEntries, filter }) => {
  return (
    <div className="filter-panel">
      <button
        type="button"
        onClick={() => setFilter('all')}
        className={`text-sm ${filter == 'all' ? 'text-black font-bold' : 'text-blue-800'}`}
      >
        All <span className="font-normal">({totalEntries})</span>
      </button>
    </div>
  );
};

export default Filter;
