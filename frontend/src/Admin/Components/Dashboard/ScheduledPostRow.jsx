import { format, isTomorrow } from 'date-fns';
import { Link } from 'react-router-dom';

const ScheduledPostRow = ({ post }) => {
  const postDate = new Date(post.post_date);

  const dateLabel = isTomorrow(postDate) ? 'Tomorrow' : format(postDate, 'MMM d, yyyy');

  const timeLabel = format(postDate, 'h:mm a').toLowerCase();

  return (
    <tr key={post.id} className="bg-gray-200 border-b border-gray-300">
      <td className="p-4">
        {dateLabel}, {timeLabel}
      </td>
      <td className="p-4">
        <Link
          to={`${
            post.post_type == 'post'
              ? `/admin/posts/edit/${post.id}`
              : post.post_type == 'page'
              ? `/admin/pages/edit/${post.id}`
              : `/admin/custom/${post.post_type}/edit/${post.id}`
          }`}
          className="text-blue-600"
        >
          {post.post_title}
        </Link>
      </td>
    </tr>
  );
};

export default ScheduledPostRow;
