import React from 'react';
import { get_post_excerpt, get_post_thumbnail } from '../Posts';
import { Link } from 'react-router-dom';

const PostsList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post) => {
        return (
          <div key={post.id} className="bg-white rounded-xl shadow p-4">
            {get_post_thumbnail(post, 'medium') ? (
              <img
                src={get_post_thumbnail(post, 'medium')}
                className="w-full"
                alt={post.post_title}
              />
            ) : (
              <div className="w-full aspect-video bg-gray-100 text-gray-300 flex items-center justify-center">
                {/* Example SVG icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[50%]"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <Link
              to={`/${post.post_name}`}
              className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer"
            >
              {post.post_title}
            </Link>
            {post.categories && (
              <div className="flex flex-row flex-wrap items-center my-4">
                {post?.categories.map((category, idx) => (
                  <Link
                    key={idx}
                    to={`/category/${category.slug}`}
                    className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
            <div
              className="text-gray-600 text-sm"
              dangerouslySetInnerHTML={{
                __html: get_post_excerpt(post) || 'No excerpt available.',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PostsList;
