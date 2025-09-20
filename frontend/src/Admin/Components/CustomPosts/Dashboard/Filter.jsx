import React from 'react';

const Filter = ({ setFilter, totalPosts, filter, posts, user }) => {
  return (
    <div className="filter-panel">
      <button
        type="button"
        onClick={() => setFilter('all')}
        className={`text-sm ${filter == 'all' ? 'text-black font-bold' : 'text-blue-800'}`}
      >
        All <span className="font-normal">({totalPosts})</span>
      </button>
      <button
        type="button"
        onClick={() => setFilter('mine')}
        className={`text-sm ${filter == 'mine' ? 'text-black font-bold' : 'text-blue-800'}`}
      >
        Mine{' '}
        <span className="font-normal">
          ({posts.filter((post) => post.post_author == user.id).length})
        </span>
      </button>
      <button
        type="button"
        onClick={() => setFilter('draft')}
        className={`text-sm ${filter == 'draft' ? 'text-black font-bold' : 'text-blue-800'}`}
      >
        Drafts{' '}
        <span className="font-normal">
          ({posts.filter((post) => post.post_status == 'draft').length})
        </span>
      </button>
      {posts.filter((post) => post.post_status == 'trash').length > 0 && (
        <button
          type="button"
          onClick={() => setFilter('trash')}
          className={`text-sm ${filter == 'trash' ? 'text-black font-bold' : 'text-red-800'}`}
        >
          Trash{' '}
          <span className="font-normal">
            ({posts.filter((post) => post.post_status == 'trash').length})
          </span>
        </button>
      )}
    </div>
  );
};

export default Filter;
