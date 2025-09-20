import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesPageContent from '../../Components/Pages/PagesPageContent.jsx';

const Pages = ({ siteTitle }) => {
  document.title = `Pages - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PagesPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Pages;
