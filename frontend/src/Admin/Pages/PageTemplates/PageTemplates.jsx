import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PageTemplatesPageContent from '../../Components/PageTemplates/PageTemplatesPageContent.jsx';

const PageTemplates = ({ siteTitle }) => {
  document.title = `Page Templates - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PageTemplatesPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PageTemplates;
