import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesCategoriesPageContent from '../../Components/Pages/PagesCategoriesPageContent.jsx';

const PagesCategories = ({ siteTitle }) => {
  document.title = `Page Categories - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PagesCategoriesPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PagesCategories;
