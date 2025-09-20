import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesTagsPageContent from '../../Components/Pages/PagesTagsPageContent.jsx';

const PageTags = ({ siteTitle }) => {
  document.title = `Page Tags - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PagesTagsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PageTags;
