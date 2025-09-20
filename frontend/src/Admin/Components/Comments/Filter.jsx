import React from 'react';

const Filter = ({ setFilter, totalComments, filter, comments, user }) => {
  return (
    <div className="filter-panel">
      <button
        type="button"
        onClick={() => setFilter('all')}
        className={`text-sm ${filter == 'all' ? 'text-black font-bold' : 'text-blue-800'}`}
      >
        All <span className="font-normal">({comments.length})</span>
      </button>
      <button
        type="button"
        onClick={() => setFilter('mine')}
        className={`text-sm ${filter == 'mine' ? 'text-black font-bold' : 'text-blue-800'}`}
      >
        Mine{' '}
        <span className="font-normal">
          ({comments.filter((comment) => comment.user_id == user.id).length})
        </span>
      </button>
    </div>
  );
};

export default Filter;
