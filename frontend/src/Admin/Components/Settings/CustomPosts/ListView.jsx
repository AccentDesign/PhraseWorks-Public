import React from 'react';
import { Link } from 'react-router-dom';

const ListView = ({
  posts,
  selectedIds,
  toggleCheckbox,
  restorePost,
  binPost,
  permanentlyDeletePost,
  allSelected,
  toggleAllCheckboxes,
}) => {
  const normalizePostTypeName = (name) => {
    return name
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAllCheckboxes}
              className="chexkbox mt-1"
            />
          </th>
          <th scope="col">Title</th>
          <th scope="col">Database Slug</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, idx) => (
          <tr key={idx}>
            <td scope="row" className="table-checkbox-cell">
              <input
                id="default-checkbox"
                type="checkbox"
                value={post.id}
                checked={selectedIds.includes(post.id)}
                onChange={() => toggleCheckbox(post.id)}
                className="checkbox"
              />
            </td>
            <td className="flex flex-col">
              <div className="flex-center">
                <Link to={`/admin/settings/custom_posts/post/${post.id}`} className="link-bold">
                  {post.name}
                </Link>
              </div>
              <div className="flex-center-4">
                {post.status == 'trash' ? (
                  <>
                    <p>
                      <button className="link-blue-xs" onClick={() => restorePost(post.id)}>
                        Restore
                      </button>
                    </p>
                    <p>
                      <button
                        className="link-red-xs"
                        onClick={() => permanentlyDeletePost(post.id)}
                      >
                        Permanently Delete
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <button
                        className="link-red-xs"
                        onClick={() => {
                          binPost(post.id);
                        }}
                      >
                        Bin
                      </button>
                    </p>
                  </>
                )}
              </div>
            </td>
            <td>{normalizePostTypeName(post.name)}</td>
            <td>{post.description ? post.description : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
