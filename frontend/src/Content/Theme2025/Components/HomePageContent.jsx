import React, { useEffect, useState } from 'react';
import { get_posts } from '../../../Includes/Posts';
import PostsList from '@/Includes/Shortcodes/PostsList.jsx';
import Pagination from '@/Includes/Shortcodes/Pagination.jsx';
import HomepageFeatured from './HomepageFeatured';

const HomePageContent = () => {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      const postsTmp = await get_posts(page, perPage, 'post');
      setPosts(postsTmp.data);
      setTotal(postsTmp.total);
    };
    fetchData();
  }, [page]);

  return (
    <div>
      <HomepageFeatured />
      <h2 className="text-4xl font-bold mb-4 text-center mb-10">Posts</h2>
      <PostsList posts={posts} />
      <Pagination total={total} page={page} perPage={perPage} setPage={setPage} />
    </div>
  );
};

export default HomePageContent;
