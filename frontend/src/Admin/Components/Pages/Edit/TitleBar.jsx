import React from 'react';

const TitleBar = ({ post }) => {
  const origin = window.location.origin;
  return (
    <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
      <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
        <div>
          <h2 className="text-3xl">Edit Page</h2>
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
