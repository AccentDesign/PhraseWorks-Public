import React from 'react';
import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import CustomFieldCell from './CustomFieldCell';

const ListView = ({
  posts,
  selectedIds,
  toggleCheckbox,
  restorePost,
  binPost,
  publishPost,
  draftPost,
  permanentDelete,
  allSelected,
  toggleAllCheckboxes,
  postTableFields,
}) => {
  const fieldRenderers = window.__FIELD_RENDERERS__ || {};
  const { postType } = useParams();
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
          {postTableFields
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .slice(1)
            .map((field, idx) => (
              <th key={idx} scope="col">
                {field.title}
              </th>
            ))}
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
            {postTableFields
              ?.slice()
              .sort((a, b) => a.order - b.order)
              .slice(1)
              .map((field, idx) => (
                <Fragment key={idx}>
                  {field.name == 'title' && (
                    <td className="flex flex-col">
                      <div className="flex flex-row items-center">
                        <Link
                          to={`/admin/custom/${postType}/edit/${post.id}`}
                          className="text-blue-700 font-bold"
                        >
                          {post.post_title} -{' '}
                          <span className="text-gray-800">{post.post_status}</span>
                        </Link>
                      </div>
                      <div className="flex flex-row items-center gap-4">
                        {post.post_status == 'publish' && (
                          <p>
                            <Link to={`/${post.post_name}`} className="link-blue-xs">
                              View
                            </Link>
                          </p>
                        )}
                        {post.post_status == 'trash' ? (
                          <>
                            <p>
                              <button className="link-blue-xs" onClick={() => restorePost(post.id)}>
                                Restore
                              </button>
                            </p>
                            <p>
                              <button
                                className="link-red-xs"
                                onClick={() => permanentDelete(post.id)}
                              >
                                Permanently Delete
                              </button>
                            </p>
                          </>
                        ) : (
                          <>
                            {post.post_status != 'publish' && (
                              <p>
                                <button
                                  className="link-blue-xs"
                                  onClick={() => {
                                    publishPost(post.id);
                                  }}
                                >
                                  Publish
                                </button>
                              </p>
                            )}
                            {post.post_status != 'draft' && (
                              <p>
                                <button
                                  className="link-blue-xs"
                                  onClick={() => {
                                    draftPost(post.id);
                                  }}
                                >
                                  Draft
                                </button>
                              </p>
                            )}
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
                  )}
                  {field.name == 'author' && <td>{post.author.user_login}</td>}
                  {field.name == 'categories' && <td>-</td>}
                  {field.name == 'tags' && <td>-</td>}
                  {field.name == 'date' && <td>{new Date(post.post_date).toLocaleDateString()}</td>}
                  {fieldRenderers[field.name] && fieldRenderers[field.name](post)}
                  {!['title', 'author', 'categories', 'tags', 'date'].includes(field.name) &&
                    !fieldRenderers[field.name] && (
                      <CustomFieldCell postId={post.id} fieldName={field.name} />
                    )}
                </Fragment>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
