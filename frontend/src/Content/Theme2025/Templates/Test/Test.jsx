import React, { useEffect, useState } from 'react';
import Heading from './Components/Heading';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { get_content, get_post_thumbnail } from '@/Includes/Functions';
import { get_field } from '@/Includes/Functions';
import HeadMeta from '@/Utils/HeadMeta';
import { get_post_image_alt_tag } from '@/Includes/Posts';
import { useLocation } from 'react-router-dom';
import { useShortcodes } from '@/Includes/Shortcodes/ShortcodesContext';
import ContentWrapper from '../../../../Includes/ContentWrapper';
import Adminbar from '../../../../Includes/AdminBar';
import { getCurrentPost } from '../../../../Utils/PostStore';
import Content from '@/Includes/Content';

const Test = () => {
  const location = useLocation();
  const currentPathSegment = location.pathname.split('/').filter(Boolean).pop() || '';
  const shortcodes = useShortcodes();
  const [post, setPost] = useState(null);
  const [text1, setText1] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setPost(getCurrentPost());
      const imageUrlTmp = await get_post_thumbnail(getCurrentPost(), 'banner');
      setImageUrl(imageUrlTmp);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadField = async () => {
      if (post?.id) {
        const t1 = await get_field(post.id, 'text-1');
        setText1(t1);
      }
    };

    loadField();
  }, [post?.id]);
  return (
    <>
      <HeadMeta pageTitle={post?.post_title} description="Page in the site" post={post} />
      <div className="bg-gray-200 content min-h-screen top-0 flex flex-col">
        <ContentWrapper>
          <Adminbar page={post} />
          <Header />
          <div className="w-full md:w-[calc(100%-12rem)] mx-auto px-1 py-2 md:px-8 md:py-5 bg-white">
            <Heading pageData={post} />
            <p>Test.jsx</p>
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
                className="w-[200px] text-gray-300"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
            <Content
              pageData={post}
              posts={[post]}
              total={0}
              page={1}
              perPage={1}
              setPage={() => {}}
              shortcodes={shortcodes}
            />
            {text1 && (
              <div className="mt-4">
                <strong>Text Field:</strong> {text1}
              </div>
            )}
          </div>
        </ContentWrapper>
        <Footer />
      </div>
    </>
  );
};

export default Test;
