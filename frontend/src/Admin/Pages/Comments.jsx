import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import CommentsPageContent from '../Components/CommentsPageContent.jsx';

const Comments = ({ siteTitle }) => {
  document.title = `Dashboard - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <CommentsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Comments;
