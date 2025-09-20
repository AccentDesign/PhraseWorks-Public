import React from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

const ListView = ({
  comments,
  selectedIds,
  toggleCheckbox,
  permanentDelete,
  allSelected,
  toggleAllCheckboxes,
}) => {
  const formatCommentDate = (isoDate) => {
    const date = new Date(isoDate);

    const timePart = format(date, 'h:mm a');
    const datePart = format(date, 'do MMMM yyyy');
    const relativePart = formatDistanceToNow(date, { addSuffix: true });

    return `${timePart}, ${datePart}, ${capitalize(relativePart)}`;
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
          <th scope="col">Post</th>
          <th scope="col">Excerpt</th>
          <th scope="col">Author</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment, idx) => (
          <tr key={idx}>
            <td scope="row" className="table-checkbox-cell">
              <input
                id="default-checkbox"
                type="checkbox"
                value={comment.comment_id}
                checked={selectedIds.includes(comment.comment_id)}
                onChange={() => toggleCheckbox(comment.comment_id)}
                className="checkbox"
              />
            </td>

            <td className="flex flex-col">
              <div className="flex flex-row items-center">
                <Link
                  to={`/admin/posts/edit/${comment.comment_post_id}`}
                  className="text-blue-700 font-bold"
                >
                  {comment.post.post_title}
                </Link>
              </div>
              <div className="flex flex-row items-center gap-4">
                <p>
                  <button
                    className="link-red-xs"
                    onClick={() => permanentDelete(comment.comment_id)}
                  >
                    Permanently Delete
                  </button>
                </p>
              </div>
            </td>
            <td>
              {comment.comment_content.slice(0, 150)}
              {comment.comment_content.length > 150 ? '...' : ''}
            </td>
            <td>{comment.user.display_name}</td>
            <td>{formatCommentDate(comment.comment_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListView;
