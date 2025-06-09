import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import { get_author } from '../../../Utils/Authors';
import { get_posts_by_author } from '../../../Utils/Posts';
import PostsList from '../../../Utils/Shortcodes/PostsList.jsx';
import Pagination from '../../../Utils/Shortcodes/Pagination.jsx';

const Author = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  document.title = `Author`;

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_author(id);
      setAuthor(data);
      const postsTmp = await get_posts_by_author(page, perPage, id);
      setPosts(postsTmp.posts);
      setTotal(postsTmp.total);
    };
    fetchData();
  }, [page]);

  return (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0 flex flex-col">
      <div className="pt-[5rem] lg:pt-[8rem] f-1">
        <Header />
        <PageContent>
          <p>Posts By: {author?.user_nicename}</p>
          <PostsList posts={posts} />
          <Pagination total={total} page={page} perPage={perPage} setPage={setPage} />
        </PageContent>
      </div>
      <Footer />
    </div>
  );
};

export default Author;
