import React from 'react';
import { Link } from 'react-router-dom';

const AuthorBlock = ({ post }) => {
  return (
    <Link to={`/author/${post?.post_author}`} className="hover:text-blue-600">
      Author:{' '}
      <span className="underline decoration-gray-400 underline-offset-4 text-gray-500">
        {post?.author?.display_name}
      </span>
    </Link>
  );
};

export default AuthorBlock;
