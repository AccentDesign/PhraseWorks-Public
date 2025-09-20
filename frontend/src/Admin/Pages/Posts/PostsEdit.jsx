import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PostsEditPageContent from '../../Components/Posts/PostsEditPageContent.jsx';
import { get_post_by } from '../../../Includes/Posts.js';
import { useState } from 'react';
import { useEffect } from 'react';

const PostsEdit = ({ siteTitle }) => {
  document.title = `Edit Post - ${siteTitle}`;
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const fetchPostData = async () => {
    const data = await get_post_by('id', id);
    if (data != null) {
      setPost(data);
    }
  };
  useEffect(() => {
    fetchPostData();
  }, []);

  return (
    <>
      <Header post={post} />

      <PageContent>
        <PostsEditPageContent id={id} p={post} />
      </PageContent>
      <Footer />
    </>
  );
};

export default PostsEdit;
