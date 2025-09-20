import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import Content from '@/Includes/Content';
import AuthorBlock from '../Components/Blocks/AuthorBlock.jsx';
import DateBlock from '../Components/Blocks/DateBlock.jsx';
import CategoriesBlock from '../Components/Blocks/CategoriesBlock.jsx';
import HeadMeta from '@/Utils/HeadMeta.jsx';
import { get_post_image_alt_tag, get_post_thumbnail } from '@/Includes/Functions';
import { useState } from 'react';
import { useEffect } from 'react';
import { useShortcodes } from '@/Includes/Shortcodes/ShortcodesContext';
import { useLocation } from 'react-router-dom';
import ContentWrapper from '../../../Includes/ContentWrapper.jsx';
import Adminbar from '../../../Includes/AdminBar.jsx';

const Page = ({ pageData, posts, total, page, perPage, setPage }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const location = useLocation();
  const currentPathSegment = location.pathname.split('/').filter(Boolean).pop() || '';
  const shortcodes = useShortcodes();

  useEffect(() => {
    const fetchData = async () => {
      const imageUrlTmp = await get_post_thumbnail(pageData, 'banner');
      setImageUrl(imageUrlTmp);
    };
    if (pageData != null) {
      fetchData();
    }
  }, [pageData]);

  return (
    <>
      <HeadMeta pageTitle={pageData?.post_title} description="Page in the site" post={pageData} />
      <div className="bg-gray-200 content min-h-screen top-0 flex flex-col">
        <ContentWrapper>
          <Adminbar page={pageData} />
          <Header />
          <PageContent>
            <h2 className="text-4xl font-bold">{pageData?.post_title}</h2>
            <AuthorBlock post={pageData} />
            <DateBlock post={pageData} />
            <CategoriesBlock post={pageData} />
            {imageUrl != null && imageUrl != '' ? (
              <img
                src={imageUrl}
                alt={get_post_image_alt_tag(pageData)}
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
            <Content
              pageData={pageData}
              posts={posts}
              total={total}
              page={page}
              perPage={perPage}
              setPage={setPage}
              shortcodes={shortcodes}
            />
          </PageContent>
        </ContentWrapper>
        <Footer />
      </div>
    </>
  );
};

export default Page;
