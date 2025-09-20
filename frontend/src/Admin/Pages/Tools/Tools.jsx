import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import ToolsPageContent from '../../Components/Tools/ToolsPageContent.jsx';

const Tools = ({ siteTitle }) => {
  document.title = `Cron Events - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <ToolsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Tools;
