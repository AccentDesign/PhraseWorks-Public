import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PageContent from '../Components/PageContent.jsx';
import HelpPageContent from '../Components/HelpPageContent.jsx';

const Help = ({ siteTitle }) => {
  document.title = `Help - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <HelpPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Help;
