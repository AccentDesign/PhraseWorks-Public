import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PostsCategoriesPageContent from '../../Components/Posts/PostsCategoriesPageContent.jsx';

const PostsCategories = ({ siteTitle }) => {
  document.title = `Post Categories - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PostsCategoriesPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PostsCategories;
