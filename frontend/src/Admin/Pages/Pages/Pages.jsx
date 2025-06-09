import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PagesPageContent from '../../Components/Pages/PagesPageContent.jsx';

const Pages = ({ siteTitle }) => {
  document.title = `Pages - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PagesPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default Pages;
