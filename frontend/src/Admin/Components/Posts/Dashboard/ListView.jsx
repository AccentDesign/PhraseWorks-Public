import React from 'react';
import { Link } from 'react-router-dom';

const ListView = ({
  posts,
  selectedIds,
  toggleCheckbox,
  restorePost,
  binPost,
  publishPost,
  draftPost,
  allSelected,
  toggleAllCheckboxes,
}) => {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
        <tr>
          <th scope="col" className="px-6 py-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAllCheckboxes}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            />
          </th>
          <th scope="col" className="px-6 py-3">
            Title
          </th>
          <th scope="col" className="px-6 py-3">
            Author
          </th>
          <th scope="col" className="px-6 py-3">
            Categories
          </th>
          <th scope="col" className="px-6 py-3">
            Tags
          </th>
          <th scope="col" className="px-6 py-3">
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, idx) => (
          <tr
            key={idx}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
          >
            <th
              scope="row"
              className="px-6 py-4 w-[40px] font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <input
                id="default-checkbox"
                type="checkbox"
                value={post.id}
                checked={selectedIds.includes(post.id)}
                onChange={() => toggleCheckbox(post.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
              />
            </th>
            <td className="px-6 py-4 flex flex-col">
              <div className="flex flex-row items-center">
                <Link to={`/admin/posts/edit/${post.id}`} className="text-blue-700 font-bold">
                  {post.post_title} - <span className="text-gray-800">{post.post_status}</span>
                </Link>
              </div>
              <div className="flex flex-row items-center gap-4">
                {post.post_status == 'publish' && (
                  <p>
                    <Link
                      to={`/${post.post_name}`}
                      className="text-blue-700 text-sm underline underline-offset-4 hover:text-blue-500"
                    >
                      View
                    </Link>
                  </p>
                )}
                {post.post_status == 'trash' ? (
                  <>
                    <p>
                      <button
                        className="text-blue-700 text-sm underline underline-offset-4 hover:text-blue-500"
                        onClick={() => restorePost(post.id)}
                      >
                        Restore
                      </button>
                    </p>
                    <p>
                      <button className="text-red-700 text-sm underline underline-offset-4 hover:text-blue-500">
                        Permanently Delete
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    {post.post_status != 'publish' && (
                      <p>
                        <button
                          className="text-blue-700 text-sm underline underline-offset-4 hover:text-blue-500"
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
                          className="text-blue-700 text-sm underline underline-offset-4 hover:text-blue-500"
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
                        className="text-red-700 text-sm underline underline-offset-4 hover:text-blue-500"
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
            <td className="px-6 py-4">{post.author.user_login}</td>
            <td className="px-6 py-4">-</td>
            <td className="px-6 py-4">-</td>
            <td className="px-6 py-4">{new Date(post.post_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
