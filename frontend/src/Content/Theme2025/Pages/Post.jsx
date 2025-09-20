import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import {
  get_post,
  get_content,
  get_post_thumbnail,
  get_post_image_alt_tag,
} from '@/Includes/Functions';
import AuthorBlock from '../Components/Blocks/AuthorBlock.jsx';
import DateBlock from '../Components/Blocks/DateBlock.jsx';
import CategoriesBlock from '../Components/Blocks/CategoriesBlock.jsx';
import HeadMeta from '@/Utils/HeadMeta.jsx';
import PostCustomFields from '../Components/PostCustomFields.jsx';
import { useShortcodes } from '@/Includes/Shortcodes/ShortcodesContext';
import PostComments from '../Components/PostComments.jsx';
import AdminBar from '../../../Includes/AdminBar.jsx';
import ContentWrapper from '../../../Includes/ContentWrapper.jsx';
import { get_page_post } from '../../../Includes/Posts.js';
import { handleComponentError } from '../../../Utils/ErrorHandler';

const Post = ({ post: initialPost = null }) => {
  const location = useLocation();
  const currentPathSegment = location.pathname.split('/').filter(Boolean).pop() || '';
  const shortcodes = useShortcodes();
  const [post, setPost] = useState(initialPost);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await get_page_post(initialPost, post, setPost, setImageUrl);
      } catch (error) {
        await handleComponentError(error, 'Post', 'fetchData', {
          additionalData: {
            postId: post?.id,
            postTitle: post?.post_title,
            currentPath: location.pathname,
          },
        });
      }
    };
    fetchData();
  }, [initialPost, post?.post_title, location.pathname]);

  return (
    <>
      <HeadMeta pageTitle={post?.post_title} description="Post in the site" post={post} />
      <div className="bg-gray-200 content min-h-screen top-0 flex flex-col">
        <ContentWrapper>
          <AdminBar post={post} />
          <Header />
          <PageContent>
            <h1 className="text-4xl font-bold mb-4">{post?.post_title}</h1>
            <AuthorBlock post={post} />
            <DateBlock post={post} />
            <CategoriesBlock post={post} />
            {imageUrl != null && imageUrl != '' ? (
              <img
                src={imageUrl}
                alt={get_post_image_alt_tag(post)}
                className="w-full mb-4 rounded"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[200px] text-gray-300 mb-4"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
            {get_content(post, shortcodes, { currentPathSegment })}
            <PostCustomFields post={post} />
            <PostComments post={post} />
          </PageContent>
        </ContentWrapper>
        <Footer />
      </div>
    </>
  );
};

export default Post;
