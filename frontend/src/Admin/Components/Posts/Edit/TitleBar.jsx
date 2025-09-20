import React from 'react';
import { Link } from 'react-router-dom';

const TitleBar = ({ post }) => {
  const origin = window.location.origin;
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div>
          <h2 className="text-3xl">Edit Post</h2>
          {post?.post_status == 'publish' && (
            <p>
              <strong className="text-gray-500">Permalink:</strong>{' '}
              <a
                href={`${origin}${post?.guid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-500 underline underline-offset-4"
              >
                {origin}
                {post?.guid}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
