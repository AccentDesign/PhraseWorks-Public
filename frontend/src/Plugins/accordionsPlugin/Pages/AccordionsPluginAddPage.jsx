import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import PageContent from '../../../Admin/Components/PageContent.jsx';
import PluginPageAddContent from './Components/PluginPageAddContent.jsx';

const AccordionPluginAddPage = ({ siteTitle }) => {
  document.title = `Dashboard - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PluginPageAddContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default AccordionPluginAddPage;
