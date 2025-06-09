import React, { useEffect, useState } from 'react';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import { get_post, get_content, get_post_thumbnail } from '../../../Utils/Posts.js';

const Post = () => {
  const [post, setPost] = useState(null);
  document.title = `Post - ${post?.post_title}`;

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_post();
      setPost(data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0 flex flex-col">
      <div className="pt-[5rem] lg:pt-[8rem] f-1">
        <Header />
        <PageContent>
          <p>{post?.post_title}</p>
          <p>{post?.author?.user_login}</p>
          <p>{post?.post_date && new Date(post?.post_date).toDateString()}</p>
          <img src={get_post_thumbnail(post, 'large')} />
          {get_content(post)}
        </PageContent>
      </div>
      <Footer />
    </div>
  );
};

export default Post;
