import React from 'react';
import { Link } from 'react-router-dom';
import { createSafeMarkup } from '@/Utils/sanitizeHtml';
import PostThumbnail from './PostThumbnail';
import { get_post_excerpt } from '../Posts';

const PostsList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-black text-white md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          {/* Image with hover zoom and gradient overlay */}
          <div className="relative overflow-hidden group">
            <PostThumbnail post={post} />
            <div
              className="absolute bottom-0 z-10 h-60 w-full 
                bg-gradient-to-t from-black via-black/40 to-transparent 
                pointer-events-none 
                transition-colors duration-300 
                group-hover:from-black/60 group-hover:via-black/20 group-hover:to-transparent"
            />
          </div>

          {/* Content */}
          <div className="px-4 pb-4">
            <Link
              to={`/${post.post_name}`}
              className="mt-4 block text-lg font-medium text-gray-100 hover:text-white transition-colors"
            >
              {post.post_title}
            </Link>

            {post.categories && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.categories.map((category, idx) => (
                  <span
                    key={idx}
                    className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#E0724A] to-[#9938CA] text-transparent bg-clip-text"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <div
              className="mt-3 text-gray-400 text-sm"
              dangerouslySetInnerHTML={{
                __html: get_post_excerpt(post) || 'No excerpt available.',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
