import React, { useEffect, useState } from 'react';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import { get_post, get_content, get_post_thumbnail } from '../../../Utils/Posts.js';
import { Link } from 'react-router-dom';

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
          <h1 className="text-4xl font-bold mb-4">{post?.post_title}</h1>
          <Link to={`/author/${post?.post_author}`} className="hover:text-blue-600">
            Author:{' '}
            <span className="underline decoration-gray-400 underline-offset-4 text-gray-500">
              {post?.author?.user_login}
            </span>
          </Link>
          <p className="text-gray-500 text-sm">
            {post?.post_date && new Date(post?.post_date).toDateString()}
          </p>
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
          <img src={get_post_thumbnail(post, 'large')} />
          {get_content(post)}
        </PageContent>
      </div>
      <Footer />
    </div>
  );
};

export default Post;
