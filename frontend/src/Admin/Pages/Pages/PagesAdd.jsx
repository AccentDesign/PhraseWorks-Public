import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesAddPageContent from '../../Components/Pages/PagesAddPageContent.jsx';

const PagesAdd = ({ siteTitle }) => {
  document.title = `Add Page - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PagesAddPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PagesAdd;
