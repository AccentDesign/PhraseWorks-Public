import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import DocsPageContent from '../Components/DocsPageContent.jsx';

const Docs = ({ siteTitle }) => {
  document.title = `Docs - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <DocsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Docs;
