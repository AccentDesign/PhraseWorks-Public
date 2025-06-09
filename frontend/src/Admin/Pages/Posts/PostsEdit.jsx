import React from 'react';
import { useParams } from 'react-router-dom';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PostsEditPageContent from '../../Components/Posts/PostsEditPageContent.jsx';

const PostsEdit = ({ siteTitle }) => {
  document.title = `Edit Post - ${siteTitle}`;
  const { id } = useParams();
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PostsEditPageContent id={id} />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default PostsEdit;
