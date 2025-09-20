import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import { get_author, get_posts_by_author } from '@/Includes/Functions';
import PostsList from '@/Includes/Shortcodes/PostsList.jsx';
import Pagination from '@/Includes/Shortcodes/Pagination.jsx';
import HeadMeta from '@/Utils/HeadMeta.jsx';
import ContentWrapper from '../../../Includes/ContentWrapper.jsx';
import Adminbar from '../../../Includes/AdminBar.jsx';

const Author = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_author(id);
      setAuthor(data);
      const postsTmp = await get_posts_by_author(page, perPage, id);

      setPosts(postsTmp.data);
      setTotal(postsTmp.total);
    };
    fetchData();
  }, [page]);

  return (
    <>
      <HeadMeta pageTitle="Author" description="Browse posts and content created by this author." />
      <div className="bg-gray-200 content min-h-screen top-0 flex flex-col">
        <ContentWrapper>
          <Adminbar />
          <Header />
          <PageContent>
            <h2 className="text-4xl font-bold mb-4">Author: {author?.user_nicename}</h2>
            <PostsList posts={posts} />
            <Pagination total={total} page={page} perPage={perPage} setPage={setPage} />
          </PageContent>
        </ContentWrapper>
        <Footer />
      </div>
    </>
  );
};

export default Author;
