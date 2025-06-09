import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesCategoriesPageContent from '../../Components/Pages/PagesCategoriesPageContent.jsx';

const PagesCategories = ({ siteTitle }) => {
  document.title = `Page Categories - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PagesCategoriesPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default PagesCategories;
