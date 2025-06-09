import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesAddPageContent from '../../Components/Pages/PagesAddPageContent.jsx';

const PagesAdd = ({ siteTitle }) => {
  document.title = `Add Page - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PagesAddPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default PagesAdd;
