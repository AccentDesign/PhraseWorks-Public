import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PostsTagsPageContent from '../../Components/Posts/PostsTagsPageContent.jsx';

const PostTags = ({ siteTitle }) => {
  document.title = `Post Tags - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PostsTagsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PostTags;
