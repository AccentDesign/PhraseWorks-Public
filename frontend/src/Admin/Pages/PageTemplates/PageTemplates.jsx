import React from 'react';
import VerifyLogin from '../../../VerifyLogin';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import PageTemplatesPageContent from '../../Components/PageTemplates/PageTemplatesPageContent.jsx';

const PageTemplates = ({ siteTitle }) => {
  document.title = `Page Templates - ${siteTitle}`;
  return (
    <VerifyLogin>
      <Header />

      <PageContent>
        <PageTemplatesPageContent />
      </PageContent>
      <Footer />
    </VerifyLogin>
  );
};

export default PageTemplates;
