import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PostsPageContent from '../../Components/Posts/PostsPageContent.jsx';

const Dashboard = ({ siteTitle }) => {
  document.title = `Posts - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PostsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Dashboard;
